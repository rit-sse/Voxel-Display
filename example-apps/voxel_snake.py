# snake for voxel 
import sys
sys.path.append('../python_pocket-api/')
from main import VoxelDisplay
import tkinter as Tkinter
import random
import time
# direction 0 - up, 1 - down, 2 - right, 3 - left, 4 - front, 5 - back
class Snake:
	def __init__(self, canvas, tkCanvas):
		self.direction = 0 
		self.body = []
		self.size = 1
		self.head = (4,4,4)
		self.game_over = False
		self.canvas = canvas
		self.tk = tkCanvas
		self.rat = (8,4,4)
		self.draw_rat = True
	
	def draw_snake(self):
		self.canvas.clearState()
		for seg in self.body:
			self.canvas.setVoxel( seg[0], seg[1], seg[2] )
		if (self.draw_rat):
			self.canvas.setVoxel( self.rat[0], self.rat[1], self.rat[2] )
			self.draw_rat = False
		else:
			self.draw_rat = True
		self.canvas.flush()
		
	def update_direction(self, event):
		print("new direction %r" % event.char)
		direction = event.char
		if (direction == 'q' and self.direction != 1):
			self.direction = 0
		elif (direction == 'a' and self.direction != 0):
			self.direction = 1
		elif (direction == 'w' and self.direction != 3):
			self.direction = 2
		elif (direction == 's' and self.direction != 2):
			self.direction = 3
		elif (direction == 'e' and self.direction != 5):
			self.direction = 4
		elif (direction == 'd' and self.direction != 4):
			self.direction = 5
			
	def update_snake(self):
		if self.game_over:
			return
		hd = self.head
		self.body.append(hd)
		if (self.direction == 0): # u
			self.head = (hd[0] + 1, hd[1], hd[2])
		elif (self.direction == 1): # d
			self.head = (hd[0] - 1, hd[1], hd[2])
		elif (self.direction == 2): # r
			self.head = (hd[0], hd[1] + 1, hd[2])
		elif (self.direction == 3): # l
			self.head = (hd[0], hd[1] - 1, hd[2])
		elif (self.direction == 4): # f
			self.head = (hd[0], hd[1], hd[2] + 1)
		elif (self.direction == 5): # b
			self.head = (hd[0], hd[1], hd[2] - 1)
		if (len(self.body) > self.size):
			self.body.pop(0)
		self.draw_snake()
		if (self.head in self.body):
			self.game_over = True
		if (self.head == self.rat):
			self.size = self.size + 1
			self.rat = (self.size * 5, 4, 4)
		if (self.game_over != True):
			self.tk.after(250, self.update_snake)
			
def randomPosition(size):
	return (round(random.randrange(size)),
		round(random.randrange(size)),
		round(random.randrange(size)))
	
def newGame():
	top = Tkinter.Tk()
	top.configure(bg="white")
	can = Tkinter.Canvas(top)
	can.pack()
	can.focus_set()
	voxel = VoxelDisplay()
	snake = Snake(voxel, can)
		
	top.after(1500, snake.update_snake)
	can.bind("<Key>", snake.update_direction)
	
	top.mainloop()
			
if __name__ == '__main__':
	newGame()