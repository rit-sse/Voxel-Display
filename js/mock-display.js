/* global THREE: false */
/* global requestAnimationFrame: true */
/* global VoxelDisplay: true */
/* jslint browser: true */

var State = function(){}; //State base class. Because reasons.
State.prototype.handleByte = function(byte) {
  return this;
};

var Awaiting = function(mock) {
  if (!(this instanceof Awaiting)) {return new Awaiting(mock);}
  
  this.mock = mock;
};
Awaiting.prototype = Object.create( State.prototype );

Awaiting.prototype.handleByte = function(byte) {
  switch (byte) {
    case 0x10: { //Prepare to recieve yplanes
      return new YPlaneBuilder(this.mock);
    }
    case 0x9: { //Prepare to recieve xplanes
      return new XPlaneBuilder(this.mock);
    }
    default: {
      return this; //Invalid bit pattern when awaiting input
    }
  }
};

var XPlaneBuilder = function(mock){
  if (!(this instanceof XPlaneBuilder)) {return new XPlaneBuilder(mock);}
  this.row = 0;
  this.plane = 0;
  this.zlevel = 0;
  this.xplanes = [];
  for (var i=0;i<(mock.depth+1);i++) {
    this.xplanes[i] = [];
    for (var j=0;j<mock.width;j++) {
      this.xplanes[i][j] = [];
      for (var k=0;k<mock.height;k++) {
        this.xplanes[i][j][k] = 0;
      }
    }
  }
  this.mock = mock;
};
XPlaneBuilder.prototype = Object.create( State.prototype );

XPlaneBuilder.prototype.handleByte = function(byte){
  switch (byte) {
    case 0x10: {
      this.mock.pushXPlanes(this.xplanes);
      return new YPlaneBuilder(this.mock);
    }
    case 0xff: {
      this.mock.pushXPlanes(this.xplanes);
      return new Awaiting(this.mock);
    }
    default: {
      this.xplanes[this.plane][this.row][this.zlevel] = byte;
      this.zlevel += 1;
      if (this.zlevel>=this.mock.height) {
        this.zlevel = 0;
        this.row += 1;
        if (this.row>=this.mock.width) {
          this.row = 0;
          this.plane += 1;
          if (this.plane>=(this.mock.depth+1)) {
            //We aught to be done now. If more bytes appear... let it error?
          }
        }
      }
      return this;
    }
  }
};

var YPlaneBuilder = function(mock){
  if (!(this instanceof YPlaneBuilder)) {return new YPlaneBuilder(mock);}
  this.row = 0;
  this.plane = 0;
  this.zlevel = 0;
  this.yplanes = [];
  for (var i=0;i<(mock.width+1);i++) {
    this.yplanes[i] = [];
    for (var j=0;j<mock.depth;j++) {
      this.yplanes[i][j] = [];
      for (var k=0;k<mock.height;k++) {
        this.yplanes[i][j][k] = false;
      }
    }
  }
  this.mock = mock;
};
YPlaneBuilder.prototype = Object.create( State.prototype );

YPlaneBuilder.prototype.handleByte = function(byte){
  switch (byte) {
    case 0x9: {
      this.mock.pushYPlanes(this.yplanes);
      return new XPlaneBuilder(this.mock);
    }
    case 0xff: {
      //Push out
      this.mock.pushYPlanes(this.yplanes);
      return new Awaiting(this.mock);
    }
    default: {
      this.yplanes[this.plane][this.row][this.zlevel] = byte;
      this.zlevel += 1;
      if (this.zlevel>=this.mock.height) {
        this.zlevel = 0;
        this.plane += 1;
        if (this.plane>=(this.mock.width+1)) {
          this.plane = 0;
          this.row += 1;
          if (this.row>=(this.mock.depth)) {
            //We aught to be done now. If more bytes appear... let it error?
          }
        }
      }
      return this;
    }
  }
};

var JSVoxels = function() {
  if (!(this instanceof JSVoxels)) {return new JSVoxels();}
  var self = this;
  
  this.readbuffer = new Uint8Array(0);
  this.state = new Awaiting(this);
  this.scene = new THREE.Scene(); 
  this.size = 200;
  this.offset = new THREE.Vector3(-this.size/2,0,-this.size/2);
  this.renderer = new THREE.WebGLRenderer({ antialias: true }); 
  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapSoft = true;
  this.renderer.setSize( window.innerWidth, window.innerHeight );   
  
  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapSoft = true;
  this.renderer.shadowMapWidth = 1024;
  this.renderer.shadowMapHeight = 1024;
  
  document.body.appendChild( this.renderer.domElement );
  
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 ); 
  directionalLight.position.set( 150, 150, 100 ); 
  directionalLight.castShadow = true;
  
  directionalLight.shadowDarkness = 0.5;
  directionalLight.shadowMapWidth = 2048;
  directionalLight.shadowMapHeight = 2048;
  
  var csize = 250;
  directionalLight.shadowCameraLeft = -csize;
  directionalLight.shadowCameraRight = csize;
  directionalLight.shadowCameraTop = csize;
  directionalLight.shadowCameraBottom = -csize;
  
  directionalLight.shadowCameraFar = 3000;
  
  this.scene.add( directionalLight );
  
  this.scene.add(new THREE.AmbientLight( 0x212223));
  
  this.planemat = new THREE.MeshPhongMaterial({color: 0xefefef, side: THREE.DoubleSide, transparent: true, opacity: 0.95});
  
  var geometry2 = new THREE.CubeGeometry(1000,1,1000);
  var material2 = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0x193af0, specular: 0x001188, shininess: 5, shading: THREE.SmoothShading  });
  var cube2 = new THREE.Mesh( geometry2, material2 ); 
  cube2.position = new THREE.Vector3(0,-1,0);
  cube2.receiveShadow = true;
  this.scene.add( cube2 ); 

  window.addEventListener( 'resize', function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );

  this.width = 8;
  this.depth = 8;
  this.height = 8;
  
  this.vd = new VoxelDisplay(this.width,this.depth,this.height,this);
  
  this.count = 0;
  function render() {
    requestAnimationFrame(render);  
    self.count += 1;
    self.renderer.render(self.scene, self.camera); 
  }
  
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
  this.camera.position.z = 350;
  this.camera.position.y = 350;
  this.camera.far = 8000;
  this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  this.controls.minDistance = 200;
  this.controls.maxDistance = 1000;
  this.controls.target = new THREE.Vector3(0,50,0);
  this.scene.add(this.camera);
  
  this.renderer.setClearColor(0xeeeeff);
  
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

JSVoxels.prototype.write = function(bytes) {
  this.readbuffer = bufferConcat(this.readbuffer, bytes);
  while (this.readbuffer.length>0) {
    this.state = this.state.handleByte(this.readbuffer[0]);
    this.readbuffer = this.readbuffer.subarray(1);
  }
};

JSVoxels.prototype.runScript = function(evt) {
  var file = evt.target.files[0];
  
  if (!file) 
    return
    
  var reader = new FileReader();
  reader.onload = function(f){
    return function(e){
      console.log(eval(e.target.result));
    }(f);
  };
  reader.readAsText(file);
};

JSVoxels.prototype.toggleVoxel = function() {
  var x = Math.floor(document.querySelector(".x").value);
  var y = Math.floor(document.querySelector(".y").value);
  var z = Math.floor(document.querySelector(".z").value); //Math.floor likes to coerce things into numbers
  
  this.vd.toggleVoxel(x,y,z);
  this.vd.flush();
};

JSVoxels.prototype.pushXPlanes = function(planes) {
  if (this.xplanes) {
    this.scene.remove(this.xplanes);
  }
  
  var xplanes = new THREE.Geometry();
  for (var i=0;i<planes.length;i++) {
    var xplane = new THREE.PatchworkPlane(planes[i], this.size, this.size);
    var mesh = new THREE.Mesh(xplane, this.planemat);
    mesh.rotation.y = -Math.PI/2;
    mesh.position.x = (i/(planes.length-1)) * this.size;
    THREE.GeometryUtils.merge(xplanes, mesh);
  }
  
  this.xplanes = new THREE.Mesh(xplanes, this.planemat);
  this.xplanes.position = this.xplanes.position.add(this.offset);
  this.scene.add(this.xplanes);
};

JSVoxels.prototype.pushYPlanes = function(planes) {
  if (this.yplanes) {
    this.scene.remove(this.yplanes);
  }
  
  var yplanes = new THREE.Geometry();
  for (var i=0;i<planes.length;i++) {
    var yplane = new THREE.PatchworkPlane(planes[i], this.size, this.size);
    var mesh = new THREE.Mesh(yplane, this.planemat);
    mesh.position.z = (i/(planes.length-1)) * this.size;
    THREE.GeometryUtils.merge(yplanes, mesh);
  }
  
  this.yplanes = new THREE.Mesh(yplanes, this.planemat);
  this.yplanes.position = this.yplanes.position.add(this.offset);
  this.scene.add(this.yplanes);
};

document.addEventListener('DOMContentLoaded', function() {
  MockDisplay = new JSVoxels();
  document.getElementById('file').addEventListener('change', MockDisplay.runScript, false);
});

