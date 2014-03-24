import socket

# This api let's you use the api as an instance of voxel display, not as a class you have to extend
# This means that YOU have to supply your own loops and threads
class VoxelDisplay():
  def __init__ ( self ):
    self.voxels = []

    self.sock = socket.socket( socket.AF_INET, socket.SOCK_STREAM)
    self.sock.connect( ("localhost", 8999 ) )

  def flush( self ):
      line = ""
      line = ", ".join([ " ".join( str(i) for i in v) for v in self.voxels ])
      print(line)
      if len(line) > 0:
        self.sock.send( bytes(line  + "\n", 'UTF-8') )

  def setVoxel( self, x, y, z ):
    self.voxels.append( (x,y,z) )

  def toggleVoxel( self, x, y, z ):
    if (x, y, z) in self.voxels:
        index = self.voxels.index( (x,y,z) )
        self.voxels.pop( index )
    else:
        self.setVoxel( x, y, z )

  def getState( self ):
    return self.voxels

  def clearState( self ):
    self.voxels = []
