import threading
import socket
import time


class VoxelDisplay( threading.Thread ):
  def __init__ (self):
    threading.Thread.__init__( self )
    self.frameRate = 1
    self.loop = True
    self.voxels = [ ]

    self.sock = socket.socket( socket.AF_INET, socket.SOCK_STREAM)
    self.sock.connect( ("localhost", 8999 ) )

  def run( self ):
    while True:
      time.sleep( 1.0 / self.frameRate )
      self.voxels = []
      self.draw( )


      # I'm sorry
      line = ""
      line = ",".join([ " ".join( str(i) for i in v) for v in self.voxels ])
      print(line)
      if len(line) > 0:
        self.sock.send( bytes(line  + "\n", 'UTF-8') )

  def setVoxel( self, x, y, z ):
    self.voxels += [(x,y, z)]
