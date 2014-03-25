require '../ruby_pocket-api/main'

vd = VoxelDisplay.new()

wave = [5, 4, 3, 2, 3, 4, 5, 5]
width = ARGV[0] ? ARGV[0].to_i : 1
while true
  0.upto(7).each do |i|
    0.upto(7).each do |j|
      height = wave[(i+j)%8]
      7.downto(height).each do |h|
        0.upto(width-1).each do |w|
          vd.set_voxel( j, h, w)
        end
      end
    end
    vd.flush
    vd.clear_state
    sleep(0.5)
  end
end
