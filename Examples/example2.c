/*
 * example.c attempts to mimic the functionality of example.py in a
 * C-oriented way
 * Written by David Dubois
 */

// include the API
#include "../APIs/C/vd_VoxelDisplay_c.h"

#include <stdio.h>
#include <time.h>

#define SECONDS_PER_FRAME 0.5

int main( int argc, char **argv );
void draw( struct VoxelDisplay *vd, int i );

void draw( struct VoxelDisplay *vd, int i ) {
    struct Vec3 vox = { 1, 1, i % 8 };
    vd_setVoxelOn( vd, vox );
    vox.x = vox.y = vox.z = 4;
    vd_toggleVoxel( vd, vox );
}

int main( int argc, char **argv ) {
    struct VoxelDisplay *vd = malloc( sizeof( struct VoxelDisplay ) );
    if( vd_genDisplay6x6x6( vd ) != 0 ) {
        printf( "ERROR: Could not create display. Shutting down...\n" );
        return 0;
    }
    
    printf( "Display initialized" );

    vd_clear( vd );
    vd_flush( vd );

    time_t startTime = time( NULL );
    int i = 0;
    while( 1 ) {
        if( difftime( time( NULL ), startTime ) > SECONDS_PER_FRAME ) {
            draw( vd, i );
            vd_flush( vd );
            time( &startTime );
            i++;
        }
    }
}

