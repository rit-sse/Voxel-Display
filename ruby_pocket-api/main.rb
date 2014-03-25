require 'socket'
include Socket::Constants

class VoxelDisplay

  def initialize()
    @voxelHash = Hash.new(false)

    @socket = Socket.new( AF_INET, SOCK_STREAM, 0 )
    sockaddr = Socket::pack_sockaddr_in( 8999, '127.0.0.1' )
    @socket.connect( sockaddr )
    puts "CONNECTED"

  end

  def set_voxel( x, y, z )
    @voxelHash[ [x, y, z] ] = true
  end

  def toggle_voxel( x, y, z )
    key = [x,y,z]
    @voxelHash[key] = @voxelHash.has_key?(key) ? !@voxelHash[key] : true
  end

  def clear_state
    @voxelHash = {}
  end

  def get_state
    @voxelHash
  end

  def flush
    # puts for now, socket code for actual implementation
    res = @voxelHash.select { |k,v| v } ::keys.map {|k| k.join(?\ )} ::join(", ")
    puts res
    @socket.write(res+"\n")
  end

end
