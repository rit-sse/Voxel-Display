require '../APIs/ruby/InstanceAPI'

vd = VoxelDisplay.new()

while true
  0.upto(7).each do |i|
    0.upto(7).each do |j|
      0.upto(7).each do |k|
        vd.set_voxel( k, j, i )
        sleep(0.01)
        vd.flush
      end
      sleep(0.01)
      vd.flush
    end
    vd.flush
    sleep(0.01)
  end
  vd.clear_state
  vd.flush
end
