THREE.PatchworkPlane = function(patches, worldx, worldy) {
  
  THREE.Geometry.call( this );
  
  var width_segments = patches.length;
  var height_segments = patches[0].length;
  
  var normal = new THREE.Vector3(0,0,1);
  var color = new THREE.Color( 0xfefefe );
  
  var uva = new THREE.Vector2(0,0);
  var uvb = new THREE.Vector2(1,0);
  var uvc = new THREE.Vector2(1,1);
  var uvd = new THREE.Vector2(0,1);
  
  for (var x=0;x<width_segments;x++) {
    var xcoord = x/(width_segments) * worldx;
    var nextxcoord = (x+1)/(width_segments) * worldx;
    for (var y=0;y<height_segments;y++) {
      var ycoord = y/(width_segments) * worldy;
      var nextycoord = (y+1)/(width_segments) * worldy;
      if (patches[x] && patches[x][y] && patches[x][y]>0) {
        var vert1 = new THREE.Vector3(xcoord,ycoord,0);
        var vert2 = new THREE.Vector3(nextxcoord,ycoord,0);
        var vert3 = new THREE.Vector3(xcoord,nextycoord,0);
        var vert4 = new THREE.Vector3(nextxcoord,nextycoord,0);
        
        var count = this.vertices.length;
        this.vertices.push(vert1);
        this.vertices.push(vert2);
        this.vertices.push(vert3);
        this.vertices.push(vert4);
        
        
        var face = new THREE.Face3(count, count+1, count+2, normal.clone(), color, 0);
        face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
        this.faces.push( face );
        this.faceVertexUvs[ 0 ].push( [ uva.clone(), uvb.clone(), uvd.clone() ] );

        var face2 = new THREE.Face3(count+2, count+1, count+3, normal.clone(), color, 1);
        face2.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
        this.faces.push( face2 );
        this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc.clone(), uvd.clone() ] );
      }
    }
  }
  
  this.computeCentroids();
  this.mergeVertices();
};

THREE.PatchworkPlane.prototype = Object.create( THREE.Geometry.prototype );