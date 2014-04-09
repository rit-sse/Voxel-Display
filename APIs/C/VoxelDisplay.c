/*
 * \author David Dubois
 *
 * This file provides a number of funcitons which can be used to interface with
 * the Society of Software Engineers' Voxel Display
 */
#include "VoxelDisplay.c"
 
int vd_genDisplay( VoxelDisplay *display, int xSize, int ySize, int zSize ) {
    if( (display = malloc( sizeof( VoxelDisplay ) )) == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    display->xSize = xSize;
    display->ySize = ySize;
    display->zSize = zSize;
    display->totSize = xSize * ySize * zSize / 8;
    if( (display->voxels = malloc( display->totSize )) == NULL ) {
        free( display );
        return VD_VOXELS_NOT_ALLOCATED;
    }
    return 0;
}

int vd_genDisplay8x8x8( VoxelDisplay *display ) {
    return vd_genDisplay( display, 8, 8, 8 );
}
 
int vd_setVoxelOn( VoxelDisplay *display, Vec3 toSet ) {
   if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    if( toSet.x >= display->xSize || 
        toSet.y > display->ySize || 
        toSet.z > display->zSize ) {
        return VD_VOXEL_OUT_OF_RANGE;
    }
    display->voxels[toSet.z + toSet.y * display->zSize / 8] |= (1 << toSet.x);
    return 0;
 }

int vd_voxelOff( VoxelDisplay *display, Vec3 toSet ) {
   if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    if( toSet.x >= display->xSize || 
        toSet.y > display->ySize || 
        toSet.z > display->zSize ) {
        return VD_VOXEL_OUT_OF_RANGE;
    }
    display->voxels[toSet.z + toSet.y * display->zSize / 8] &= ~(1 << toSet.x);
    return 0;
}

int vd_toggleVoxel( VoxelDisplay *dispay, Vec3 toToggle ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    if( toSet.x >= display->xSize || 
        toSet.y > display->ySize || 
        toSet.z > display->zSize ) {
        return VD_VOXEL_OUT_OF_RANGE;
    }
    display->voxels[toSet.z + toSet.y * display->zSize / 8] ^= (1 << toSet.x);
    return 0;
}

int vd_clear( VoxelDisplay *display ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    memset( display->voxels, 0, display-totSize );
    return 0;
}

int vd_flush( VoxelDisplay *display ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    display->socket->sendData( display->voxels, display->totSize );
    return 0;
}

int vd_getVoxels( VoxelDisplay *display, char *voxels ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    voxels = malloc( display->totSize );
    memcpy( voxels, display->voxels, display->totSize );
    return 0;
}

int vd_setVoxels( VoxelDisplay *display, char *data ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    memcpy( display->voxels, data, display->totSize );
    return 0;
}

