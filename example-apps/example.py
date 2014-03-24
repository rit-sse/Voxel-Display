import sys
sys.path.append('../python-api/')
from main import VoxelDisplay

class MyDisplay(VoxelDisplay):

    def __init__( self ):
        VoxelDisplay.__init__( self )

        self.frameRate =  10
        self.i = 0


    def draw( self ):
        self.setVoxel( 1, 0, self.i % 5 )
        #self.setVoxel( 1, 1, self.i % 5 )
        #self.setVoxel( 1, 2, self.i % 5 )
        #self.setVoxel( 0, 1, self.i % 5 )
        #self.setVoxel( 2, 1, self.i % 5 )
        self.i += 1



e = MyDisplay()
e.start()

print("OK")
