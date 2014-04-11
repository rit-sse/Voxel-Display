/*
Hexis is a game for 3D displays. 
The front panel shows a blinking heximo piece. You have limited time to move it on that face.
When the selected one is chosen (press space), it 'falls' backwards toward the rear panel,
And stacks on top of other panels aready there. Whenever a layer fills, it is removed.
The goal is to continue to fill as many layers as possible.
*/

(function() {
  var Keybinder = null;
  var VoxelDisplay = null;
  var Display = null;
  var clrTimer = null;

  var KEY_SPACE = 32;
  var KEY_W = 87;
  var KEY_A = 65;
  var KEY_S = 83;
  var KEY_D = 68;
  var KEY_Q = 81;
  var KEY_E = 69;

  if (typeof process === 'undefined' || !process.versions) {
    Keybinder = function(f) {
      window.addEventListener('keydown', f);
    };
    VoxelDisplay = window.VoxelDisplay;
    Display = MockDisplay;
    clrTimer = window.clearInterval;
  } else {
    KEY_SPACE = ' ';//32;
    KEY_W = 'w';//87;
    KEY_A = 'a';//65;
    KEY_S = 'a';//83;
    KEY_D = 'd';//68;
    KEY_Q = 'q';//81;
    KEY_E = 'e';//69;
    
    clrTimer = clearInterval;

    var handle = function(e) {};
    var stdin = process.openStdin(); 
    require('tty').setRawMode(true);  

    stdin.on('keypress', function(chunk, key) {
      if (key && key!==null)
        handle({keyCode: key.name});
    });
    Keybinder = function(handler) {
      handle = handler;
    };
    process.stdin.resume();

    var VD = require("voxeldisplay");
    VoxelDisplay = VD.VoxelDisplay;
    Display = VD.HardwareDisplay("COM6"); //Should pull from command line args
  }

  var maxx, maxy, maxz;
  maxx = 8; maxy = 8; maxz = 8;

  var vd = new VoxelDisplay(maxx, maxy, maxz, Display); //Get me a new display driver to use

  var heximos = {
    /*"bar": [[1,0,0,0,0,0],
          [1,0,0,0,0,0],
          [1,0,0,0,0,0],
          [1,0,0,0,0,0],
          [1,0,0,0,0,0],
          [1,0,0,0,0,0]],
  "L": [[0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [1,0,0,0,0,0],
        [1,0,0,0,0,0],
        [1,0,0,0,0,0],
        [1,1,1,0,0,0]],
  "block": [[0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [1,1,1,0,0,0],
            [1,1,1,0,0,0]],
  "-/": [[0,0,0,0,0,0],
         [0,0,0,0,0,0],
         [0,0,0,0,0,1],
         [0,0,0,0,0,1],
         [0,0,0,0,0,1],
         [0,0,0,1,1,1]]*/
    "block": [[0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [0,0,0,0,0,0],
              [1,1,0,0,0,0],
              [1,1,0,0,0,0]],
    "bar": [[0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [1,0,0,0,0,0],
            [1,0,0,0,0,0],
            [1,0,0,0,0,0],
            [1,0,0,0,0,0]],
    "t": [[0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,1,0,0,0,0],
          [1,1,1,0,0,0]],
    "ll": [[0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [1,0,0,0,0,0],
           [1,0,0,0,0,0],
           [1,1,0,0,0,0]],
    "rl": [[0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,1,0,0,0,0],
           [0,1,0,0,0,0],
           [1,1,0,0,0,0]],
    "lz": [[0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [1,1,0,0,0,0],
           [0,1,1,0,0,0]],
    "rz": [[0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,0,0,0,0,0],
           [0,1,1,0,0,0],
           [1,1,0,0,0,0]]
  };

  function random_pair(obj) {
    var keys = [];
    for(var temp_key in obj) {
      if(obj.hasOwnProperty(temp_key)) {
        keys.push(temp_key);
      }
    }

    var chosen = keys[Math.floor(Math.random() * keys.length)];
    return {k: chosen, v: obj[chosen]};
  }

  var Voxel = function(x,y,z) {
    if (!(this instanceof Voxel)) {return new Voxel(x,y,z);}
    this.x = x;
    this.y = y;
    this.z = z;
  };
  Voxel.prototype.setState = function(state) {
    vd.setVoxel(this.x, this.y, this.z, state);
  };
  Voxel.prototype.getState = function() {
    if (vd.voxels[this.x] && vd.voxels[this.x][this.y] && vd.voxels[this.x][this.y][this.z]) {
      return vd.voxels[this.x][this.y][this.z];
    }
  };
  Voxel.prototype.add = function(vobj){
    return new Voxel(this.x+vobj.x, this.y+vobj.y, this.z+vobj.z);
  };
  Voxel.prototype.sub = function(vobj){
    return new Voxel(this.x-vobj.x, this.y-vobj.y, this.z-vobj.z);
  };
  Voxel.prototype.equals = function(vobj) {
    return ((vobj.x === this.x) && (vobj.y === this.y) && (vobj.z === this.z));
  };

  var DISPLAY_MIN = new Voxel(0,0,0);
  var DISPLAY_MAX = new Voxel(vd.width-1, vd.depth-1, vd.height-1);

  var VoxelCluster = function(list) {
    if (!(this instanceof VoxelCluster)) {return new VoxelCluster();}

    this.voxels = [];
    this.visibile = true;
    if (list) {
      for (var i=0; i<list.length; i++) {
        this.add(list[i]);
      }
    }
    this.bounds = {min: DISPLAY_MIN, max: DISPLAY_MAX};
    this.calculateBoundingBox();
  };
  VoxelCluster.prototype.add = function(vobj) {
    if (!(this.contains(vobj))) {
      this.voxels.push(vobj);
      this.calculateBoundingBox();
    }
  };
  VoxelCluster.prototype.contains = function(vobj) {
    for (var i=0;i<this.voxels.length;i++) {
      if (this.voxels[i].equals(vobj)) {
        return true;
      }
    }
    return false;
  };
  VoxelCluster.prototype.calculateBoundingBox = function() {
    var minx, miny, minz;
    var maxx, maxy, maxz;

    for (var i=0;i<this.voxels.length;i++) {
      var v = this.voxels[i];
      if (minx===undefined || v.x<minx)
        minx = v.x;
      if (miny===undefined  || v.y<miny)
        miny = v.y;
      if (minz===undefined  || v.z<minz)
        minz = v.z;
      if (maxx===undefined  || v.x>maxx)
        maxx = v.x;
      if (maxy===undefined  || v.y>maxy)
        maxy = v.y;
      if (maxz===undefined  || v.z>maxz)
        maxz = v.z;
    }

    this.bounds = {min: new Voxel(minx, miny, minz), max: new Voxel(maxx, maxy, maxz)};
  };
  VoxelCluster.prototype.move = function(x,y,z,state) {
    this.visible = (state===null || state===undefined) ? this.visible : state;
    var offset = new Voxel(x,y,z);
    var newvoxels = [];
    for (var i=0;i<this.voxels.length;i++) { 
      this.voxels[i].setState(false);
      var newv = this.voxels[i].add(offset);
      newvoxels.push(newv);
    }
    this.voxels = newvoxels;
    this.setVisibility(this.visible);
    this.calculateBoundingBox();
  };
  VoxelCluster.prototype.setVisibility = function(bool) {
    this.visible = bool;
    for (var i=0;i<this.voxels.length;i++) { 
      this.voxels[i].setState(bool);
    }
  };

  var Heximo = function(layout) {
    if (!(this instanceof Heximo)) {return new Heximo(layout);}

    this.voxels = new VoxelCluster();

    for (var y=0; y<layout.length; y++) {
      for (var x=0; x<layout[y].length; x++) {
        if (layout[x][y]>0) {
          this.voxels.add(new Voxel(x, 0, y));
        }
      }
    }
    this.voxels.setVisibility(true);
  };
  var plusOneZ = new Voxel(0,0,1);
  Heximo.prototype.nudgeUp = function() {
    var bounds = this.voxels.bounds;
    if (bounds.max.z<(DISPLAY_MAX.z)) {
      if (!(this.checkDest(plusOneZ))) {
        return;
      }
      this.voxels.move(0,0,1);
    }
  };
  var minusOneZ = new Voxel(0,0,-1);
  Heximo.prototype.nudgeDown = function() {
    var bounds = this.voxels.bounds;
    if (bounds.min.z>DISPLAY_MIN.z) {
      if (!(this.checkDest(minusOneZ))) {
        return;
      }
      this.voxels.move(0,0,-1);
    }
  };
  var plusOneX= new Voxel(1,0,0);
  Heximo.prototype.nudgeRight = function() {
    var bounds = this.voxels.bounds;
    if (bounds.max.x<(DISPLAY_MAX.x)) {
      if (!(this.checkDest(plusOneX))) {
        return;
      }
      this.voxels.move(1,0,0);
    }
  };
  var minusOneX = new Voxel(-1,0,0);
  Heximo.prototype.nudgeLeft = function() {
    var bounds = this.voxels.bounds;
    if (bounds.min.x>DISPLAY_MIN.x) {
      if (!(this.checkDest(minusOneX))) {
        return;
      }
      this.voxels.move(-1,0,0);
    }
  };
  Heximo.prototype.checkDest = function(offset) {
    for (var i=0; i<this.voxels.voxels.length; i++) {
      var v = this.voxels.voxels[i];
      var tentative = v.add(offset);
      if ((!(this.voxels.contains(tentative))) && tentative.getState()) {
        return false;
      }
    }

    return true;
  };
  var plusOneY = new Voxel(0,1,0);
  Heximo.prototype.drop = function() {
    var bounds = this.voxels.bounds;
    if (bounds.max.y>=(DISPLAY_MAX.y)) {
      return false;
    }

    if (!(this.checkDest(plusOneY))) {
      return false;
    }

    this.voxels.move(0,1,0);
    return true;
  }; 
  Heximo.prototype.rotateLeft = function() {
    var bounds = this.voxels.bounds;

    var rotated = [];
    for (var i=0; i<this.voxels.voxels.length; i++) {
      var local = this.voxels.voxels[i].sub(bounds.min);
      //2D rotations!
      //x = x cos t - y sin t - so x = -y
      //y = x sin t + y cos t = so y = x
      var rot = new Voxel(-local.z, local.y, local.x);
      rotated.push(rot.add(bounds.min));
    }

    var newv = new VoxelCluster(rotated);
    //Check if the new one is out of any x/z bounds
    var offx = 0;
    if (newv.bounds.min.x<0) {
      offx = newv.bounds.min.x*-1;
    } else if (newv.bounds.max.x>DISPLAY_MAX.x) {
      offx = (newv.bounds.max.x-DISPLAY_MAX.x)*-1;
    }

    var offz = 0;
    if (newv.bounds.min.z<0) {
      offz = newv.bounds.min.z*-1;
    } else if (newv.bounds.max.z>DISPLAY_MAX.z) {
      offz = (newv.bounds.max.z-DISPLAY_MAX.z)*-1;
    }

    this.voxels.setVisibility(false);
    //Check if any planned coords are in use
    for (var j=0; j<newv.voxels.length; j++) {
      var v = newv.voxels[j];
      newv.voxels[j] = new Voxel(v.x+offx, v.y, v.z+offz);
      if (newv.voxels[j].getState()) {
        this.voxels.setVisibility(true);
        return;
      }
    }

    this.voxels.setVisibility(false);
    this.voxels = newv;
    this.voxels.setVisibility(true);
  };
  Heximo.prototype.rotateRight = function() {
    this.rotateLeft(); //I am this lazy.
    this.rotateLeft();
    this.rotateLeft();
  };

  var Heximos = {};

  Heximos.Base = function() {
    if (!(this instanceof Heximos.Base)) {return new Heximos.Base();}
  };

  Heximos.Base.prototype.up = function() {return this;};
  Heximos.Base.prototype.down = function() {return this;};
  Heximos.Base.prototype.left = function() {return this;};
  Heximos.Base.prototype.right = function() {return this;};
  Heximos.Base.prototype.rotateleft = function() {return this;};
  Heximos.Base.prototype.rotateright = function() {return this;};
  Heximos.Base.prototype.confirm = function() {return this;};
  Heximos.Base.prototype.advance = function() {return this;};

  Heximos.Start = function(gs) {
    if (!(this instanceof Heximos.Start)) {return new Heximos.Start();}
    this.gs = gs;
    //Clear the display.
    vd.zero();
  };
  Heximos.Start.prototype = Object.create( Heximos.Base.prototype );
  Heximos.Start.prototype.advance = function() {
    return new Heximos.PieceSpawn(this.gs);
  };

  Heximos.PieceSpawn = function(gs){
    if (!(this instanceof Heximos.PieceSpawn)) {return new Heximos.PieceSpawn(gs);}
    this.gs = gs;

    this.count = 0;
    this.max = 60;

    //Check if we cleared a layer
    for (var y=0; y<=DISPLAY_MAX.y; y++) {
      var count = 0;
      for (var x=0; x<=DISPLAY_MAX.x; x++) {
        for (var z=0; z<=DISPLAY_MAX.z; z++) {
          if (Voxel(x,y,z).getState()) {
            count++;
          }
        }
      }
      if (count===((DISPLAY_MAX.x+1)*(DISPLAY_MAX.z+1))) {
        //A layer was completed!
        for (var x=0; x<=DISPLAY_MAX.x; x++) {
          for (var z=0; z<=DISPLAY_MAX.z; z++) {
            Voxel(x,y,z).setState(false);
          }
        }

        var cluster = new VoxelCluster();
        for (var ny=0;ny<y;ny++) {
          for (var x=0; x<=DISPLAY_MAX.x; x++) {
            for (var z=0; z<=DISPLAY_MAX.z; z++) {
              var v=Voxel(x,ny,z);
              if (v.getState()) {
                cluster.add(v);
              }
            }
          }
        }
        cluster.move(0,1,0, true);
      }
    }

    var choice = random_pair(heximos);
    this.heximo = new Heximo(choice.v);
  };
  Heximos.PieceSpawn.prototype = Object.create( Heximos.Base.prototype );
  Heximos.PieceSpawn.prototype.fallToBack = function() {
    while (this.heximo.drop()) {
      vd.flush();
    }
  };
  Heximos.PieceSpawn.prototype.up = function() {
    this.heximo.nudgeUp();
    return this.advance();
  };
  Heximos.PieceSpawn.prototype.down = function() {
    this.heximo.nudgeDown();
    return this.advance();
  };
  Heximos.PieceSpawn.prototype.left = function() {
    this.heximo.nudgeLeft();
    return this.advance();
  };
  Heximos.PieceSpawn.prototype.right = function() {
    this.heximo.nudgeRight();
    return this.advance();
  };
  Heximos.PieceSpawn.prototype.rotateleft = function() {
    this.heximo.rotateLeft();
    return this.advance();
  };
  Heximos.PieceSpawn.prototype.rotateright = function() {
    this.heximo.rotateRight();
    return this.advance();
  };
  Heximos.PieceSpawn.prototype.confirm = function() {
    this.fallToBack();
    return new Heximos.PieceSpawn(this.gs);
  };
  Heximos.PieceSpawn.prototype.advance = function() {
    vd.flush();
    this.count += 1;
    if (this.count>this.max) {
      if (this.heximo.drop()) {
        return new Heximos.Falling(this.gs, this.heximo);
      } else {
        console.log("Lost!");
        return new Heximos.Start(this.gs);
      }
    }
    return this;
  };

  Heximos.Falling = function(gs, heximo) {
    if (!(this instanceof Heximos.Falling)) {return new Heximos.Falling(gs, heximo);}
    this.count = 0;
    this.max = 60;

    this.gs = gs;
    this.heximo = heximo;
  };
  Heximos.Falling.prototype = Object.create( Heximos.PieceSpawn.prototype );
  Heximos.Falling.prototype.advance = function() {
    vd.flush();
    this.count += 1;
    if (this.count>this.max) {
      if (this.heximo.drop()) {
        return new Heximos.Falling(this.gs, this.heximo);
      } else {
        return new Heximos.PieceSpawn(this.gs);
      }
    }
    return this;
  };

  var Gamestate = function() {
    if (!(this instanceof Gamestate)) {return new Gamestate();}
    this.state = new Heximos.Start();
  };

  Gamestate.prototype.tick = function() {
    this.state = this.state.advance();
  };

  Gamestate.prototype.begin = function() {
    //Start game loop
    var self = this;
    this.loopid = setInterval(function() {
      self.tick();
    }, 0.1); //Tick every 10th of a second
  };

  Gamestate.prototype.stop = function() {
    clrInterval(this.loopid);
  };

  var gs = new Gamestate();

  Keybinder(function(evt) {
    var k = evt.keyCode;

    switch (k) {
      case KEY_W:
        gs.state = gs.state.up();
        break;
      case KEY_A:
        gs.state = gs.state.left();
        break;
      case KEY_S:
        gs.state = gs.state.down();
        break;
      case KEY_D:
        gs.state = gs.state.right();
        break;
      case KEY_Q:
        gs.state = gs.state.rotateleft();
        break;
      case KEY_E:
        gs.state = gs.state.rotateright();
        break;
      case KEY_SPACE:
        gs.state = gs.state.confirm();
        evt.preventDefault();
        break;
      default:
    }
  });

  gs.begin();

})();