class TkVoxelDisplay():

    # Creates the Display, takes in max x, y, and z for the display
    # width and height is the canvas width and height, tk_canvas is the canvas object
    def __init__(self, x, y, z, tk_canvas):
        self.max_x = x 
        self.max_y = y 
        self.max_z = z 
        self.voxels = [[[False]*x for i in range(y)] for i in range(z)]

        self.can = tk_canvas

    # Gets origin point for preview
    def pane_point(self, x, y, z):
        c_x = (150)+(x*10)  - (y*5)
        c_y = (350)-(z*10) - (y*5)
        return c_x, c_y

    # Draws panes that face the front
    # Should not be called directly
    def drawPane_FB(self, x, y, z, f, o):
        c_x, c_y = self.pane_point(x,y,z)
        self.can.create_rectangle( c_x, c_y, 
                              c_x+10, c_y-10, 
                              fill=f, outline=o )

    # Draws panes that face the side
    # Should not be called directly
    def drawPane_LR(self, x, y, z, f, o):
        c_x, c_y = self.pane_point(x,y,z)
        self.can.create_polygon( c_x, c_y,
                            c_x-5, c_y-5,
                            c_x-5, c_y-15,
                            c_x, c_y-10,
                            fill=f, outline=o )

    # Draws voxels using the drawPane methods
    def drawVoxel(self, x, y, z, f="", o="grey"):
        self.drawPane_FB(x, (y+1), z,    f, o)
        self.drawPane_LR(x, y, z,        f, o)
        self.drawPane_LR((x+1), y, z,    f, o)
        self.drawPane_FB(x, y, z,        f, o)

    # Sets voxel for the next flush
    def setVoxel(self, x, y, z):
        self.voxels[x][y][z] = not self.voxels[x][y][z]

    
    def flush(self):
        for j in range(self.max_x-1, -1, -1):
            for k in range(self.max_y-1, -1, -1):
                for z in range(0, self.max_z, 1):
                    if self.voxels[j][k][z]:
                        self.drawVoxel(j, k, z, "cyan", "blue")
                    else:
                        pass
                        #self.drawVoxel(j, k, z)

if __name__ == '__main__':
    import tkinter

    top = tkinter.Tk()
    can = tkinter.Canvas(top, width=400, height=400)
    can.pack()
    can.focus_set()

    vd = TkVoxelDisplay(20,20,20, can)
    vd.setVoxel(0, 0, 0)
    vd.setVoxel(19, 0, 0)
    vd.setVoxel(0, 19, 0)
    vd.setVoxel(0, 0, 19)
    vd.setVoxel(19, 19, 0)
    vd.setVoxel(0, 19, 19)
    vd.setVoxel(19, 0, 19)
    vd.setVoxel(19, 19, 19)
    vd.flush()

    top.mainloop()
