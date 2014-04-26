import sys
sys.path.append('../APIs/python/')
from InstanceAPI import VoxelDisplay

import time
vd = VoxelDisplay(True)
vd.clearState()
vd.flush()
while True:
    for i in range(0, 8):
        vd.toggleVoxel( 4, 4, 4 )
        vd.setVoxel( 1, 1, i )
        vd.flush()
        time.sleep(0.5)
    vd.clearState()
