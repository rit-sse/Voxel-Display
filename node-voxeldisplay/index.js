var SerialPort = require("serialport").SerialPort;
var util = require("util");
var EventEmitter = require("events");
var VoxelDisplay = require("voxel");

var VD = function(device) {
  this.serialPort = new SerialPort(device, {
    baudrate: 9600
  }, false);
  var self = this;
  this.serialPort.open(function() {
    self.serialPort.on('data', function(err, data) {
      self.emit('data', err, data);
    });
    self.serialPort.on('end', function(err, data) {
      self.emit('end', err, data);
    });
  });
};
util.inherits(EventEmitter, VD);

VD.prototype.write = function(buf) {
  this.serialPort.write(buf);
};

module.exports = {
  HardwareDisplay: VD,
  VoxelDisplay: VoxelDisplay
};