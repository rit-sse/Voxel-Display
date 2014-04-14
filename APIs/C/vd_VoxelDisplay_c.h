/*
 * \author David Dubois
 *
 * This file provides a number of funcitons which can be used to interface with
 * the Society of Software Engineers' Vec3Display
 */
#ifndef VD_VOXEL_DISPLAY_C_H
#define VD_VOXEL_DISPLAY_C_H
// C headers
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>

#if __linux
//linux specific includes
#include <netdb.h>
#include <netinet/in.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <strings.h>
#include <arpa/inet.h>
#include <errno.h>

#elif _WIN32
//Windows-specific includes
#include <windows.h>
#include <winsock2.h>
#endif
/* Useful structs */
struct Vec3 {
    int x;
    int y;
    int z;
};

/*
 * voxels - A pointer to the raw Vec3data. char[0] & 1 is the origin.
 *  The first row continues for xSize bits. There are zSize rows of Vec3bits,
 *  each xSize bits long. This makes up one sheet. There are ySize sheets.
 *  There may or may not be problems when xSize isn't a power of eight.
 */
struct VoxelDisplay {
    char *voxels;
    int xSize;
    int ySize;
    int zSize;
    int totSize;
#ifdef __linux
    int socket;
    struct sockaddr_in serv_addr;
#elif _WIN32
    SOCKET socket;
    SOCKADDR_IN serv_addr;
#endif
};

/* Error constants */
#define VD_VOXEL_OUT_OF_RANGE       -1
#define VD_DISPLAY_NOT_ALLOCATED    -2
#define VD_VOXELS_NOT_ALLOCATED     -3
#define VD_SOCKET_ERROR             -4
#define VD_NO_CONNECTION            -5
#define VD_NETWORK_ERROR            -6

/*
 * \brief Creates a new VoxelDisplay with the specified size
 *
 * \param [out] display A pointer to the memory to stick the created 
 *      VoxelDisplay in. It is recommended that this memory be not allocated,
 *      as anything at this location will be overwritten
 * \param [in] xSize The desired number of voxels in the x-direction
 * \param[in] ySize The desired number of voxels in the y-direction
 * \param [in] zSize The desired number of voxels in the z-direction
 *
 * \return VD_DISPLAY_NOT_ALLOCATED if memory for the display cannot be 
 *          allocated
 *         VD_VOXELS_NOT_ALLOCATED if memory for the Vec3array cannot be
 *          allocated
 *         VD_SOCKET_ERROR if the socket could not be created
 *         VD_NETWORK_ERROR if there was an error resolving the hostnamt
 *         VD_NO_CONNECTION if your program couldn't connect to the server
 *         0 if all operations succeed
 */
int vd_genDisplay( struct VoxelDisplay *display, int xSize, int ySize, int zSize );

/*
 * \brief Generates a VoxelDisplay with 8 pixels in each of the x, y, and z
 *      directions
 *
 * \param [out] display A pointer to the memory to stick the created 
 *      VoxelDisplay in. It is recommended that this memory be not allocated,
 *      as anything at this location will be overwritten 
 * \return VD_DISPLAY_NOT_ALLOCATED if memory for the display cannot be 
 *          allocated
 *         VD_VOXELS_NOT_ALLOCATED if memory for the Vec3array cannot be
 *          allocated
 *         0 if all operations succeed 
 */
int vd_genDisplay8x8x8( struct VoxelDisplay *display );

/*
 * \brief Sets the specified Vec3to the "on" state
 *
 * \param [in] display The VoxelDisplay to set a Vec3on
 * \param [in] toSet The Vec3 to turn on
 * \return VD_DISPLAY_NOT_ALLOCATED if display is a NULL pointer
 *         VD_VOXEL_OUT_OF_RANGE if toSet is outside of the bounds of the
 *          specified VoxelDisplay
 *         0 if the operation succeeds
 */
int vd_setVoxelOn( struct VoxelDisplay *display, struct Vec3 toSet );

/*
 * \brief Sets the speficied Vec3to the "off" state
 *
 * \param [in] display The VoxelDisplay to set a Vec3on
 * \param [in] toSet The Vec3 to turn on
 * \return VD_DISPLAY_NOT_ALLOCATED if display is a NULL pointer
 *         VD_VOXEL_OUT_OF_RANGE if the specified Vec3if outside of the
 *          display's bounds
 *         0 if the operation succeeds
 */
int vd_setVoxelOff( struct VoxelDisplay *display, struct Vec3 toSet );

/*
 * \brief Toggles the state of the specified Voxel
 *
 * \param [in] display The VoxelDisplay to change a Vec3on
 * \param [in] toToggle The Vec3 to toggle
 * \return VD_DISPLAY_NOT_ALLOCATED if display is a null pointer
 *         VD_VOXEL_OUT_OF_RANGE if the specified Vec3is outside of display's
 *          bounds
 *         0 if the operation succeeds
 */
int vd_toggleVoxel( struct VoxelDisplay *display, struct Vec3 toToggle );

/*
 * \brief Sets a VoxelDisplay to n empty state
 *
 * \param [in] display The display to clear the data of
 * \return VD_DISPLAY_NOT_ALLOCATED if display is a NULL pointer
 *         0 if the operation succeeds
 */
int vd_clear( struct VoxelDisplay *display );

/*
 * \brief Sends the data from the VoxelDisplay on to the physical Vec3display
 *
 * \param [in] display The VoxelDisplay to send data from
 * \return VD_DISPLAY_NOT_ALLOCATED if display is a NULL pointer
 *         0 if the operation succeeds
 */
int vd_flush( struct VoxelDisplay *display );

/*
 * \brief Allows the user to access the raw data of the specified display
 *
 * \param [in] display The VoxelDisplay to grab the data from
 * \param [out] voxels A pointer to a copy of the VoxelDisplay's raw data.
 *      Note that this doesn't let the user directly access the VoxelDisplay's
 *      data.
 * \return VD_DISPLAY_NOT_ALLOCATED if display is a NULL pointer
 *         0 if the operation succeeds
 */
int vd_getVoxels( struct VoxelDisplay *display, char *voxels );

/*
 * \brief Allows the user to upload raw data to the specified display
 *
 * Note that the data is copied by value
 *
 * \param [in] display The VoxelDisplay to send data to
 * \param [in] data The raw data to send to the VoxelDisplay
 * \return VD_DISPLAY_NOT_ALLOCATED if the display is a NULL pointer
 *         0 if the operation succeeds
 */
int vd_setVoxels( struct VoxelDisplay *display, char *data );
#endif

