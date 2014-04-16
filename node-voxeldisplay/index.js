var SerialPort = require("serialport").SerialPort;
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var VoxelDisplay = require("./voxel.js");

var serialDelay = 990; //in ms
var VD = function(device) {
  EventEmitter.call(this);
  this.serialPort = new SerialPort(device, {
    baudrate: 9600
  }, false);
  var self = this;
  this.serialPort.open(function() {
    self.serialPort.on('data', function(data) {
      self.emit('data', data);
      if (self.writequeue.length>0) {
        var msg = self.writequeue.pop();
        setTimeout(function() {
          console.log('Writing');
          self.forceWrite(msg);
        }, serialDelay);
      } else {
        self._immediate = true;
      }
    });
    self.serialPort.on('end', function(err, data) {
      self.emit('end', err, data);
    });
  });
  
  this.writequeue = [];
  this._immediate = true;
};
util.inherits(VD, EventEmitter);

VD.prototype.forceWrite = function(msg) {
  console.log('Wrote: '+msg);
  this.serialPort.write(msg);
};

VD.prototype.write = function(buf) {
  var sbuf = new Buffer(buf);
  if (this._immediate) {
    this._immediate = false;
    this.forceWrite(sbuf);
  } else {
    this.writequeue.push(sbuf);
  }
};

VD.prototype.setDisplay = function(mock) {
  //The hardware doesn't care about any info in the mock. Really.
};

module.exports = {
  HardwareDisplay: VD,
  VoxelDisplay: VoxelDisplay
};