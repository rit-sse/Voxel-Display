require '../ruby_pocket-api/main'

vd = VoxelDisplay.new()


print "Enter coordinates (x y z):\n| "
while (ui = gets().chomp) != "quit"
  vd.toggle_voxel(*ui.split)
  vd.flush
  print("| ")
end
