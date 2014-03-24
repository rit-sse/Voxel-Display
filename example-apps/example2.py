import sys
sys.path.append('../python_pocket-api/')
from main import VoxelDisplay

import time
vd = VoxelDisplay()
for i in range(0, 8):
    vd.setVoxel( 1, 1, i )
    vd.toggleVoxel( 7, 7, 7 )
    vd.flush()
    time.sleep(0.5)
