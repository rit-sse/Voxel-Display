require 'socket'
require 'set'
include Socket::Constants

class VoxelDisplay

  def initialize(debug=false)
    @voxelSet = Set.new()
    @debug = debug

    @socket = Socket.new( AF_INET, SOCK_STREAM, 0 )
    sockaddr = Socket::pack_sockaddr_in( 8999, '127.0.0.1' )
    @socket.connect( sockaddr )
    puts "CONNECTED"
  end
  
  def set_voxel( x, y, z )
    @voxelSet.add [x, y, z]
  end

  def toggle_voxel( x, y, z )
    @voxelSet ^= Set.new([[x,y,z]])
  end

  def clear_state(normal=true)
    @voxelSet = Set.new
  end

  def get_state
    @voxelSet
  end

  def flush
    res = @voxelSet.map {|e| e.join(" ")} ::join(", ")
    if @debug
      puts res
    end
    @socket.write(res+"\n")
  end

end
