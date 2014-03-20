/* global THREE: false */
/* global requestAnimationFrame: true */
/* jslint browser: true */

var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
var renderer = new THREE.WebGLRenderer(); 
renderer.setSize( window.innerWidth, window.innerHeight ); 

document.addEventListener('DOMContentLoaded', function() {

  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.CubeGeometry(1,1,1); 
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true, wireframe_linewidth: 10 } ); 
  var cube = new THREE.Mesh( geometry, material ); 
  scene.add( cube ); 

  camera.position.z = 5;

  function render() { 
    requestAnimationFrame(render); 
    
    renderer.render(scene, camera); 
  } 
  render();
});

window.addEventListener( 'resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );