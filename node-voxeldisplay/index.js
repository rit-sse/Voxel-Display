var SerialPort = require("serialport").SerialPort;
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var VoxelDisplay = require("./voxel.js");

var VD = function(device) {
  EventEmitter.call(this);
  this.serialPort = new SerialPort(device, {
    baudrate: 9600
  }, false);
  var self = this;
  this.serialPort.open(function() {
    self.serialPort.on('data', function(data) {
      self.emit('data', data);
    });
    self.serialPort.on('end', function(err, data) {
      self.emit('end', err, data);
    });
  });
};
util.inherits(VD, EventEmitter);

VD.prototype.write = function(buf) {
  this.serialPort.write(buf);
};

module.exports = {
  HardwareDisplay: VD,
  VoxelDisplay: VoxelDisplay
};