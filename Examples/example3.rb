require '../APIs/ruby/main'

vd = VoxelDisplay.new()

while true
  0.upto(7).each do |i|
    vd.set_voxel( 1, 1, i )
    vd.toggle_voxel( 7, 7, 7 )
    vd.flush
    sleep(0.5)
  end
  vd.clear_state
  vd.flush
  print("... ")
  gets
end
