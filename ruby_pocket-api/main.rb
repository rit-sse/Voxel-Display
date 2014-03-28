require 'socket'
require 'set'
include Socket::Constants

class VoxelDisplay

  def initialize(debug=false)
    @queueVoxelSet = Set.new()
    @queueVoxelBlinkSet = Set.new()

    @voxelSet = Set.new()
    @voxelBlinkSet = Set.new()

    @debug = debug

    @socket = Socket.new( AF_INET, SOCK_STREAM, 0 )
    sockaddr = Socket::pack_sockaddr_in( 8999, '127.0.0.1' )
    @socket.connect( sockaddr )
    puts "CONNECTED"

    drawThread = Thread.new do 
      while true
        if ( Time.now.strftime("%L") > "500" )
          res = (@voxelSet + @voxelBlinkSet).map {|e| e.join(" ")} ::join(", ")
        else
          res = @voxelSet.map {|e| e.join(" ")} ::join(", ")
        end
        if @debug
          puts res
        end
        @socket.write(res+"\n")
      end
    end
  end
  
  def set_voxel( x, y, z )
    @queueVoxelSet.add [x, y, z]
  end

  def set_blink_voxel( x, y, z)
    @queueVoxelBlinkSet.add [x, y, z]
  end

  def toggle_voxel( x, y, z )
    @queueVoxelSet ^= Set.new([[x,y,z]])
  end

  def toggle_blink_voxel( x, y, z )
    @queueVoxelBlinkSet ^= Set.new([[x,y,z]])
  end

  def clear_state(normal=true, blink=true)
    @queueVoxelSet = Set.new()       if normal
    @queueVoxelBlinkSet = Set.new()  if blink
  end

  def get_state
    [@voxelSet, @voxelBlinkSet]
  end

  def flush
    @voxelSet = @queueVoxelSet
    @voxelBlinkSet = @queueVoxelBlinkSet
  end

end
