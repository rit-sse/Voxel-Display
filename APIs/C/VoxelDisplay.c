/*
 * \author David Dubois
 *
 * This file provides a number of funcitons which can be used to interface with
 * the Society of Software Engineers' Voxel Display
 */
#include "vd_VoxelDisplay_c.h"

#ifdef __linux
void cleanup_linux( struct VoxelDisplay *display ) {
    free( display );
}
#endif

#ifdef _WIN32
void cleanup_win32( struct VoxelDisplay *display ) {
    WSACleanup();
    free( display );
}
#endif

int vd_genDisplay( struct VoxelDisplay *display, int xSize, int ySize, int zSize ) {
    printf( "Allocating display...\n" );
    if( (display = malloc( sizeof( struct VoxelDisplay ) )) == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    display->xSize = xSize;
    display->ySize = ySize;
    display->zSize = zSize;
    display->totSize = xSize * ySize * zSize / 8;
    printf( "Allocating raw data...\n" );
    if( (display->voxels = malloc( display->totSize )) == NULL ) {
        free( display );
        return VD_VOXELS_NOT_ALLOCATED;
    }

    void (*cleanupFunc)( struct VoxelDisplay * );
#ifdef __linux
    printf( "Compiling on Linux\n" );
    // Linux-specific networking
    // taken from http://www.linuxhowtos.org/C_C++/socket.htm
    cleanupFunc = cleanup_linux;

#elif _WIN32
    printf( "Compiling on Windoge\n" );
    // Windows-specific networking 
    // taken from http://johnnie.jerrata.com/winsocktutorial/
    cleanupFunc = cleanup_win32;
    WSAStartup( MAKEWORD( 1, 1 ) );
#endif

    // This appears to be POSIX networking or something
    // Open the socket for data transmission
    printf( "Allocating socket...\n" );
    if( (display->socket = socket( AF_INET, SOCK_STREAM, 0 )) < 0 ) {
        cleanupFunc( display );
        return VD_SOCKET_ERROR;
    }

    // Load up the server properties
    printf( "Copying server properties...\n" );
    memset( &(display->serv_addr), 0, sizeof( struct sockaddr_in ) );
    display->serv_addr.sin_family = AF_INET;
    display->serv_addr.sin_port = htons( 8999 );
    inet_aton( "127.0.0.1", &display->serv_addr.sin_addr.s_addr );

    // And now, ladies and gentlemen, the moment you've all been waiting for
    // Connection to the actual display!
    printf( "Connecting %d to the display at %s:%d...\n",
            display->socket,
            inet_ntoa( display->serv_addr.sin_addr ),
            ntohs( display->serv_addr.sin_port ) );
    if( connect( display->socket,
                 &display->serv_addr, 
                 sizeof( struct sockaddr_in ) ) < 0 ) {
        printf( "ERROR: Cannot connect to localhost. Error code %d\n", errno );
        cleanupFunc( display );
        return( VD_NO_CONNECTION );
    }
    printf( "All operations completed successfully!\n" );
    return 0;
}

int vd_genDisplay8x8x8( struct VoxelDisplay *display ) {
    return vd_genDisplay( display, 8, 8, 8 );
}
 
int vd_setVoxelOn( struct VoxelDisplay *display, struct Vec3 toSet ) {
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

int vd_voxelOff( struct VoxelDisplay *display, struct Vec3 toSet ) {
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

int vd_toggleVoxel( struct VoxelDisplay *display, struct Vec3 toToggle ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    if( toToggle.x >= display->xSize || 
        toToggle.y > display->ySize || 
        toToggle.z > display->zSize ) {
        return VD_VOXEL_OUT_OF_RANGE;
    }
    display->voxels[toToggle.z + toToggle.y * display->zSize / 8] ^= (1 << toToggle.x);
    return 0;
}

int vd_clear( struct VoxelDisplay *display ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    memset( display->voxels, 0, display->totSize );
    return 0;
}

int vd_flush( struct VoxelDisplay *display ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
#ifdef linux
    write( display->socket, display->voxels, display->totSize );
#elif _WIN32
    send( display->socket, display->voxels, display->totSize, , 00 );
#endif
    return 0;
}

int vd_getVoxels( struct VoxelDisplay *display, char *voxels ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    voxels = malloc( display->totSize );
    memcpy( voxels, display->voxels, display->totSize );
    return 0;
}

int vd_setVoxels( struct VoxelDisplay *display, char *data ) {
    if( display == NULL ) {
        return VD_DISPLAY_NOT_ALLOCATED;
    }
    memcpy( display->voxels, data, display->totSize );
    return 0;
}

