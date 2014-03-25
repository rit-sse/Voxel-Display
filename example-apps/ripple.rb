require '../ruby_pocket-api/main'

vd = VoxelDisplay.new()

def makeMap(wav)
  a, b, c, d  = *wav
  [ 
    [a, a, a, a, a, a, a, a],
    [a, b, b, b, b, b, b, a],
    [a, b, c, c, c, c, b, a],
    [a, b, c, d, d, c, b, a],
    [a, b, c, d, d, c, b, a],
    [a, b, c, c, c, c, b, a],
    [a, b, b, b, b, b, b, a],
    [a, a, a, a, a, a, a, a]
  ]
end

def printMap(wavRes)
  wavRes.each do |e|
    print e
    puts
  end
end

ripp = [5, 4, 3, 2, 3, 4]

while true
  rippMap = makeMap(ripp[0..3])
  rippMap.each_with_index do |line,x|
    line.each_with_index do |h,z|
      8.downto(h) do |y|
        vd.set_voxel(x, y, z)
      end
    end
  end
  vd.flush
  sleep(0.5)
  vd.clear_state
  ripp.push(ripp.shift)

end
