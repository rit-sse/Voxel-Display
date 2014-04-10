/*
 * \author David Dubois
 *
 * This file provides a number of funcitons which can be used to interface with
 * the Society of Software Engineers' Voxel Display
 */
#include "vd_VoxelDisplay_c.h"
 
int vd_genDisplay( struct VoxelDisplay *display, int xSize, int ySize, int zSize ) {
    if( (display = malloc( sizeof( struct VoxelDisplay ) )) == NULL ) {
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
#ifdef linux
    // Linux-specific networking
    // taken from http://www.linuxhowtos.org/C_C++/socket.htm
    // Open the socket for data transmission
    if( (display->sockfd = socket( AF_INET, SOCK_STREAM, 0 )) < 0 ) {
        free( display );
        return VD_SOCKET_ERROR;
    }

    // resolve the hostname - you could technically connect to a display
    // running on a server far away somewhere
    if( (display->server = gethostbyname( "localhost" )) == NULL ) {
        printf( "Localhost doesn't exist, you dun goofed.\n" );
        free( display );
        return VD_SOCKET_ERROR;
    }
    
    // Copy the server properties into a place where they're more useful
    bzero( (char*)&(display->serv_addr), sizeof( struct sockaddr_in ) );
    display->serv_addr.sin_family = AF_INET;
    bcopy( (char*)display->server->h_addr,
           (char*)&(display->serv_addr.sin_addr.s_addr),
           display->server->h_length );
    display->serv_addr.sin_port = htons( 8999 );
    
    // And now, ladies and gentlemen, the moment you've all been waiting for
    // Connection to the actual display!
    if( connect( display->sockfd, 
                 &display->serv_addr, 
                 sizeof( struct sockaddr_in ) ) < 0 ) {
        free( display->server );
        free( display );
        return( VD_NO_CONNECTION );
    }
#elif _WIN32
    // Windows-specific networking
    // taken from http://johnnie.jerrata.com/winsocktutorial/
    // 3 functions, 3 different naming schemes. Wonderful.
    WORD sockVersion = MAKEWORD( 1, 1 );
    WSAStartup( sockVersion, &display->wsaData );
    if( (display->hostEntry = gethostbyname( "localhost" )) == NULL ) {
        WSACleanup();
        free( display );
        return VD_NETWORK_ERROR;
    }

    // create socket
    if( (display->socket = socket( AF_INET, SOCK_STREAM, IPPROTO_TCP )) == INVALID_SOCKET ) {
        WSACleanup();
        free( display );
        return VD_SOCKET_ERROR;
    }

    // Fill a socket address structure with the things it needs
    display->serv_addr.sin_family = AF_INET;
    display->serv_addr.sin_port = htons( 8999 );
    if( connect( display->socket,
                 (LPSOCKADDR)&display->serv_addr,
                 sizeof( struct sockaddr ) ) == SOCKET_ERROR ) {
        WSACleanup();
        free( display );
        return VD_NO_CONNECTION;
    }
#endif
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
    write( display->sockfd, display->voxels, display->totSize );
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
