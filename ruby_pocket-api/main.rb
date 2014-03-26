require 'socket'
require 'set'
include Socket::Constants

class VoxelDisplay

  def initialize(debug=false)
    @voxelSet = Set.new()
    @voxelBlinkSet = Set.new()

    @debug = debug

    @socket = Socket.new( AF_INET, SOCK_STREAM, 0 )
    sockaddr = Socket::pack_sockaddr_in( 8999, '127.0.0.1' )
    @socket.connect( sockaddr )
    puts "CONNECTED"

  end

  def set_voxel( x, y, z )
    @voxelSet.add [x, y, z]
  end

  def set_blink_voxel( x, y, z)
    @voxelBlinkSet.add [x, y, z]
  end

  def toggle_voxel( x, y, z )
    @voxelSet = @voxelSet ^ Set.new([[x,y,z]])
  end

  def toggle_blink_voxel( x, y, z )
    @voxelBlinkSet = @voxelBlinkSet ^ Set.new([[x,y,z]])
  end

  def clear_state(normal=true, blink=true)
    if (normal)
      @voxelSet = Set.new()
    end
    if (blink)
      @voxelBlinkSet = Set.new()
    end
  end

  def get_state
    [@voxelSet, @voxelBlinkSet]
  end

  def flush
    # puts for now, socket code for actual implementation
    res = (@voxelSet.map {|e| e.join(" ")} ::join(", "))
    resB = (@voxelBlinkSet.map {|e| e.join(" ")} ::join(", "))
    if @debug
      puts res
      puts "b"+resB
    end
    @socket.write(res+"\n")
    @socket.write("b"+resB+"\n")
  end

end
