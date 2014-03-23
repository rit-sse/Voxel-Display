/* global THREE: false */
/* global requestAnimationFrame: true */
/* global VoxelDisplay: true */
/* jslint browser: true */

var JSVoxels = function() {
  if (!(this instanceof JSVoxels)) {return new JSVoxels();}
  
  

  this.scene = new THREE.Scene(); 
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
  this.renderer = new THREE.WebGLRenderer(); 
  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapSoft = true;
  this.renderer.setSize( window.innerWidth, window.innerHeight );   
  
  document.body.appendChild( this.renderer.domElement );
  
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); 
  directionalLight.position.set( 1, 1, 1 ); 
  this.scene.add( directionalLight );

  var geometry = new THREE.ToplessBox(1,1,1); 
  var material = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
  var cube = new THREE.Mesh( geometry, material ); 
  cube.castShadow = true;
  cube.receiveShadow = true;
  this.scene.add( cube ); 
  
  var geometry2 = new THREE.CubeGeometry(1000,1,1000); 
  var material2 = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xfefefe, specular: 0x001188, shininess: 5, shading: THREE.SmoothShading  });
  var cube2 = new THREE.Mesh( geometry2, material2 ); 
  cube2.position = new THREE.Vector3(0,-1,0);
  cube2.castShadow = false;
  cube2.receiveShadow = true;
  this.scene.add( cube2 ); 
  
  var material3 = new THREE.MeshBasicMaterial( {color: 0xeeeeff, shading: THREE.NoShading , side: THREE.BackSide});
  var skyboxMesh = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000, 1, 1, 1, null, true ), material3 );
  this.scene.add( skyboxMesh );

  
  this.camera.position.z = 5;
  this.render();
  

  window.addEventListener( 'resize', function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );

  var ORIGIN = new THREE.Vector3( 0, 0, 0 );

  /*
    37-40 = left, up, right, down
  */
  var KEY_LEFT = 37;
  var KEY_UP = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN = 40;

  window.addEventListener("keydown", function(e) {
    this.camera.lookAt(ORIGIN);
    var vector = new THREE.Vector3( 0, 0, -1 );
    vector.applyQuaternion( this.camera.quaternion );
    var dist = this.camera.position.length();
    vector = vector.multiplyScalar(dist*-1);

    var key = e.keyCode;
    var axis = new THREE.Vector3( 0, 0, 0 );
    if (key===KEY_LEFT) {
      axis = new THREE.Vector3( 0, -1, 0 );
    }
    if (key===KEY_RIGHT) {
      axis = new THREE.Vector3( 0, 1, 0 );
    }
    if (key===KEY_UP) {
      axis = new THREE.Vector3( 1, 0, 0 );
    }
    if (key===KEY_DOWN) {
      axis = new THREE.Vector3( -1, 0, 0 );
    }

    var newpos = vector.applyAxisAngle(axis.normalize(), 0.01);
    this.camera.position = newpos;
    this.camera.lookAt(ORIGIN);
  }, true);
  
  this.vd = new VoxelDisplay(8,8,8,this);
};

JSVoxels.prototype.render = function() {
  requestAnimationFrame(this.render);  
  
  this.renderer.render(this.scene, this.camera); 
};

JSVoxels.prototype.write = function(bytes) {
  for (var byte in bytes) {
    console.log(bytes);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  JSVoxels();
});
