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

all: example1 example2

example2: example2.o VoxelDisplay.o
	@echo '******************* EXAMPLE 2 *********************'
	$(CC) $(COPTS) $(CLIBS) -o example2 example2.o VoxelDisplay.o

example2.o: example2.c
	@echo '******************* EXAMPLE2.O ********************'
	$(CC) $(COPTS) $(CLIBS) -c example2.c

example1: example1.o VoxelDisplay.o
	@echo '******************** EXAMPLE 1 ********************'
	$(CC) $(COPTS) $(CLIBS) -o example1 example1.o VoxelDisplay.o

example1.o: example1.c
	@echo '******************** EXAMPLE1.O *******************'
	$(CC) $(COPTS) $(CLIBS) -c example1.c

VoxelDisplay.o: ../APIs/C/VoxelDisplay.c
	@echo '******************** VOXELDISPLAY.O ***************'
	$(CC) $(COPTS) $(CLIBS) -c ../APIs/C/VoxelDisplay.c

clean:
	rm *.o

