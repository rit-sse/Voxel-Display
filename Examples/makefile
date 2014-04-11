#clang is best compiler
CC=clang
COPTS=-std=c99


CLIBS=""
ifeq ($(OS),Windows_NT)
	CLIBS += -lwsock32
endif
ifeq ($(shell uname -s), Linux)
	#Something Linux-specific, idk
endif

all: example1

example1: example.o VoxelDisplay.o
	@echo '******************** EXAMPLE 1 ********************'
	$(CC) $(COPTS) $(CLIBS) -o example1 example.o VoxelDisplay.o

example.o: example.c
	$(CC) $(COPTS) $(CLIBS) -c example.c

VoxelDisplay.o: ../APIs/C/VoxelDisplay.c
	$(CC) $(COPTS) $(CLIBS) -c ../APIs/C/VoxelDisplay.c

