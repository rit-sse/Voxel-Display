import socket, threading, datetime

class PushThread( threading.Thread ):
    def __init__( self, voxelDisplay ):
        threading.Thread.__init__( self )
        self.vd = voxelDisplay

    def run( self ):
        while True:
            line = ""
            if ( int(datetime.datetime.now().strftime("%f"))/1000 > 500 ):
                line = ", ".join([ " ".join( str(i) for i in v) for v in ( self.vd.voxels.union(self.vd.blinkVoxels) ) ])
            else:
                line = ", ".join([ " ".join( str(i) for i in v) for v in self.vd.voxels ])
            if (self.vd.debug):
                print(line)
            self.vd.sock.send( bytes(line  + "\n", 'UTF-8') )

# This api let's you use the api as an instance of voxel display, not as a class you have to extend
# This means that YOU have to supply your own loops and threads
class VoxelDisplay():
  def __init__ ( self, debug=False ):
    self.voxels = set()
    self.blinkVoxels = set()
    self.debug = debug

    self.sock = socket.socket( socket.AF_INET, socket.SOCK_STREAM)
    self.sock.connect( ("localhost", 8999 ) )

    pt = PushThread( self )
    pt.start()

  def flush( self ):
      self.voxels = self.queueVoxels
      self.blinkVoxels = self.queueBlinkVoxels

  def setVoxel( self, x, y, z ):
    self.queueVoxels.add( (x,y,z) )

  def setBlinkVoxel( self, x, y, z ):
    self.queueBlinkVoxels.add( (x,y,z) )

  def toggleVoxel( self, x, y, z ):
    self.queueVoxels ^= set( [(x,y,z)] )

  def toggleBlinkVoxel( self, x, y, z ):
    self.queueBlinkVoxels ^= set( [(x,y,z)] )

  def getState( self ):
    return ( self.voxels.union(self.blinkVoxels) )

  def clearState( self, normal=True, blink=True ):
    if (normal):
        self.queueVoxels = set()
    if (blink):
        self.queueBlinkVoxels = set()
