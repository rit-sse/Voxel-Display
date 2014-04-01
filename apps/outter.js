/* global MockDisplay: true */
/* global VoxelDisplay: true */

var maxx, maxy, maxz;
maxx = 8; maxy = 8; maxz = 8;

var vd = new VoxelDisplay(maxx, maxy, maxz, MockDisplay); //Get me a new display driver to use
  //Note: MockDisplay.vd is the existing display, making a new one will replace it. 
  //You may use the old one, if it is preferable - but then you cannot guarantee the display's
  //state prior to beginning.



for (var x=0;x<maxx;x++) {
  for (var y=0;y<maxy;y++) {
    for (var z=0;z<maxz;z++) {
      var count = 0;
      if (x<1)
        count++;
      if (y<1)
        count++;
      if (z<1)
        count++;
      if (x>=maxx-1)
        count++;
      if (y>=maxy-1)
        count++;
      if (z>=maxz-1)
        count++;
      if (count>=2) {
        vd.toggleVoxel(x,y,z);
      }
    }
  }
}

vd.flush();