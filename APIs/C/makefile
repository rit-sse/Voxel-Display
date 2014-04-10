#clang is best compiler
CC=clang
COPTS=-std=c99
EXE=VoxelDisplay
CLIBS=""
ifeq ($(OS),Windows_NT)
	CLIBS += -lwsock32
endif
ifeq ($(shell uname -s), Linux)
	#Something Linux-specific, idk
endif

$(EXE): VoxelDisplay.o
	echo '******** CREATE EXE ********'
	$(CC) $(COPTS) $(CLIBS) -o $(EXE) VoxelDisplay.o 

VoxelDisplay.o: VoxelDisplay.c
	echo '******** BEGIN COMPILATION ********'
	$(CC) $(COPTS) $(CLIBS) -c VoxelDisplay.c

