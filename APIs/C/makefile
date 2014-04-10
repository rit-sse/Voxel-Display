CC=gcc
COPTS=-std=c99
EXE=VoxelDisplay

$(EXE): VoxelDisplay.o
	echo '******** CREATE EXE ********'
	$(CC) $(COPTS) -o $(EXE) VoxelDisplay.o 

VoxelDisplay.o: VoxelDisplay.c
	echo '******** BEGIN COMPILATION ********'
	$(CC) $(COPTS) -c VoxelDisplay.c

