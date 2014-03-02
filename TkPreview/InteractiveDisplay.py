from TkVoxelDisplay import TkVoxelDisplay 
import os, tkinter

# The TkSetup Setup
print("constructing tk window")
top = tkinter.Tk()
can = tkinter.Canvas(top, width=400, height=400)
can.pack()
can.focus_set()

# The VoxelDisplay Setup
print("create voxel display on canvas")
vd = TkVoxelDisplay(20,20,20, can)
vd.flush()

# The mkfifo setup
print("creating pipe")
os.mkfifo("/tmp/tmp_pipe")
rFIFO = open("/tmp/tmp_pipe", 'r')

ui = ""
print("starting input loop (takes 8 bytes, send 'q' to quit)")
while ("q" not in ui):
    ui = rFIFO.read(8)
    if (" " in ui):
        x,y,z = ui.split(" ")
        x = int(x)
        y = int(y)
        z = int(z)
        # Uncomment for debugging purposes
        #print("drawing at ({0}, {1}, {2})".format(x, y, z))

        vd.setVoxel(x,y,z, "cyan", "blue")
        #vd.drawVoxel(x,y,z, "cyan", "blue")
    vd.flush()
    top.update()

print("unlinking pipe")
os.unlink("/tmp/tmp_pipe")
#top.mainloop()
