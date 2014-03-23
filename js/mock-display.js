/* global THREE: false */
/* global requestAnimationFrame: true */
/* global VoxelDisplay: true */
/* jslint browser: true */

var JSVoxels = function() {
  if (!(this instanceof JSVoxels)) {return new JSVoxels();}
  var self = this;
  
  this.readbuffer = new Uint8Array(0);
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

  window.addEventListener( 'resize', function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize( window.innerWidth, window.innerHeight );
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
    self.camera.lookAt(ORIGIN);
    var vector = new THREE.Vector3( 0, 0, -1 );
    vector.applyQuaternion( self.camera.quaternion );
    var dist = self.camera.position.length();
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
    self.camera.position = newpos;
    self.camera.lookAt(ORIGIN);
  }, true);
  
  this.vd = new VoxelDisplay(8,8,8,this);
  
  this.count = 0;
  function render() {
    requestAnimationFrame(render);  
    self.count += 1;
    self.renderer.render(self.scene, self.camera); 
  }
  
  setInterval(function() {
    document.querySelector(".framecount").innerHTML = "<b>"+self.count+" FPS</b>";
    self.count = 0;
  }, 1000);
  render();
};

function bufferConcat(buf1, buf2) {
  if (buf1.length===0) { //Speedier cases
    return new Uint8Array(buf2);
  }
  if (buf2.length===0) {
    return new Uint8Array(buf1);
  }
  
  var buf = new Uint8Array(buf1.length+buf2.length); //Make a new buffer of the right length
  var done1 = false, done2 = false;
  var p1=0,p2=0;
  while (!(done1 && done2)) {
    buf[p1] = buf1[p1]; //2 arrays, one loop. Boom schakalaka.
    buf[buf1.length+p2] = buf2[p2];
    if (p1<buf1.length)
      ++p1;
    else
      done1 = true;
    
    if (p2<buf2.length)
      ++p2;
    else
      done2 = true;
  }
  return buf;
}

JSVoxels.prototype.parseByte = function(state, byte) {
  
};

JSVoxels.prototype.write = function(bytes) {
  this.readbuffer = bufferConcat(this.readbuffer, bytes);
  while (this.readbuffer.length>0) {
    this.parseByte(this.state, this.readbuffer[0]);
    this.readbuffer = this.readbuffer.subarray(1);
  }
};

JSVoxels.prototype.toggleVoxel = function() {
  var x = Math.floor(document.querySelector(".x").value);
  var y = Math.floor(document.querySelector(".y").value);
  var z = Math.floor(document.querySelector(".z").value); //Math.floor likes to coerce things into numbers
  
  this.vd.toggleVoxel(x,y,z);
  this.vd.flush();
};

document.addEventListener('DOMContentLoaded', function() {
  MockDisplay = new JSVoxels();
});
