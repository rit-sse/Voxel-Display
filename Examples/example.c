/*
 * example.c attempts to mimic the functionality of example.py in a
 * C-oriented way
 * Written by David Dubois
 */

// include the API
#include "../APIs/C/vd_VoxelDisplay_c.h"

#include <stdio.h>
#include <time.h>

#define FRAMERATE 1

int main( int argc, char **argv );
void draw( struct VoxelDisplay *vd, int i );

void draw( struct VoxelDisplay *vd, int i ) {
    vd_clear( vd );
    struct Vec3 vox = { 1, 0, i % 5 };
    vd_setVoxelOn( vd, vox );
    vox.y = 1;
    vd_setVoxelOn( vd, vox );
    vox.y = 2;
    vd_setVoxelOn( vd, vox );
    vox.x = 0;
    vox.y = 1;
    vd_setVoxelOn( vd, vox );
    vox.x = 2;
    vd_setVoxelOn( vd, vox );
}

int main( int argc, char **argv ) {
    struct VoxelDisplay *vd = malloc( sizeof( struct VoxelDisplay ) );
    if( vd_genDisplay8x8x8( vd ) != 0 ) {
        printf( "ERROR: Could not create display. Shutting down...\n" );
        return 0;
    }
    
    printf( "Display initialized" );

    time_t startTime = time( NULL );
    int i = 0;
    while( 1 ) {
        if( difftime( time( NULL ), startTime ) > FRAMERATE ) {
            printf( "Time for an update\n" );
//            vd_printVoxels( vd->voxels, vd->xSize, vd->ySize, vd->zSize );
            draw( vd, i );
            vd_flush( vd );
            time( &startTime );
            i++;
        }
    }
}

