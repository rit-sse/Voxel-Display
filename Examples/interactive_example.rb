require '../APIs/ruby/InstanceAPI'
require 'curses'
include Curses

vd = VoxelDisplay.new
vd.clear_state
vd.flush

init_screen
noecho
start_color
init_pair(COLOR_GREEN,COLOR_GREEN,COLOR_BLACK)
init_pair(COLOR_RED,COLOR_RED,COLOR_BLACK)
init_pair(COLOR_WHITE,COLOR_WHITE,COLOR_BLACK)
attrset(color_pair(COLOR_WHITE))

addstr "Interactive Example\n"
addstr "Press q to quit\n"
addstr "Enter coordinates \n| x y z\n| "

ui = ""
cVoxel = nil
valid = false

while (/q/ =~ ui) == nil
  c = getch
  if c == 10
    if valid
      vd.toggle_voxel(*ui.split)
      vd.flush
      ui = ""
      addstr "\n"
    end
  elsif c == 127 or c == 8
    ui.chop!
  else
    ui += c
  end
  if (ui.empty?)
    attrset(color_pair(COLOR_WHITE))
    addstr "\r| #{ui}#{" "*(20-ui.size)}:Enter Coords "
    if valid
      vd.toggle_voxel(*cVoxel)
    end
    valid = false
  elsif ((/^([0-7]\s){2}[0-7]$/ =~ ui) == nil)
    attrset(color_pair(COLOR_RED))
    addstr "\r| #{ui}#{" "*(20-ui.size)}:Invalid Input"
    if valid
      vd.toggle_voxel(*cVoxel)
    end
    valid = false
  else
    attrset(color_pair(COLOR_GREEN))
    addstr "\r| #{ui}#{" "*(20-ui.size)}:Valid Input  "
    valid = true
    vd.toggle_voxel(*ui.split)
    cVoxel = ui.split
  end
  vd.flush
end
