import sys
sys.path.append('../python/')
from InstanceAPI import VoxelDisplay

import time
vd = VoxelDisplay(True)
vd.clearState()
vd.flush()
while True:
    vd.toggleBlinkVoxel( 4, 4, 4 )
    print("a")
    for i in range(0, 8):
        print("b")
        vd.setVoxel( 1, 1, i )
        vd.flush()
        time.sleep(0.5)
    vd.clearState()
