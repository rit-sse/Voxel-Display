require '../APIs/ruby/main'
require 'curses'
include Curses

vd = VoxelDisplay.new()
vd.clear_state
vd.flush

init_screen
noecho
start_color
init_pair(COLOR_GREEN,COLOR_GREEN,COLOR_BLACK)
init_pair(COLOR_RED,COLOR_RED,COLOR_BLACK)
init_pair(COLOR_CYAN,COLOR_CYAN,COLOR_BLACK)
init_pair(COLOR_WHITE,COLOR_WHITE,COLOR_BLACK)
attrset(color_pair(COLOR_WHITE))

addstr "Connect3D\n"
addstr "The first to 10 Connections WINS!\n"
addstr "Press q to quit\n| "

ui = ""
valid = false
turn = 0
nturn = false
boardXZ = Hash.new([])
playerColors = [COLOR_CYAN, COLOR_GREEN]
playerSetV = [:set_voxel, :set_blink_voxel]
playerTogV = [:toggle_voxel, :toggle_blink_voxel]

def score_board( board )
  sBoard = Hash.new({:player=>-1, :checks=>[]})

  board.each do |k,v|
    x, z = *k
    v.each_with_index do |p, y|
      sBoard[ [x,y,z] ] = {:player=>p, :checks=>[]}
    end
  end

  # cBoard - current board
  # cPlayer - current player we are tallying
  # cValue - current value for connect
  # cX, cY, cZ - current position
  # dX, dY, dZ - difference in position (so we know where to go next)
  def check_neighbor( cBoard, tPlayer, cValue, cX, cY, cZ, dX, dY, dZ )
    tSpace = cBoard[ [cX, cY, cZ] ]
    if ( tSpace[:player] == cPlayer ) and 
       ( !tSpace[:checks].include?([dX.abs, dY.abs, dZ.abs]) )
          cBoard[ [cX, cY, cZ] ] = {:player => tSpace[:player],
                                    :checks => tSpace[:checks]+[dX.abs, dY.abs, dZ.abs]}
          check_neighbor( cBoard, cPlayer, cValue+1, 
                          cX+dX, cY+dY, cZ+dZ, dX, dY, dZ
                        )
    else
      cValue

      ############# DEBUGGING
      if cValue > 1
        puts "PLAYER: #{cPlayer},\n #{dX}, #{dY}, #{dZ},\n VALUE: #{cValue}"
        getch
      end

    end
  end

  0.upto(7) {|x| 0.upto(7) { |y| 0.upto(7) { |z| 
    -1.upto(1) { |dX| -1.upto(1) { |dY |-1.upto(1) { |dZ|
      [0, 1].each { |player| check_neighbor( sBoard, player, 0, 
                                             x, y, z, dX, dY, dZ
                                           ) } 
    } } } 
  } } } 

end

while (/q/ =~ ui) == nil

  ####### USER INPUT ##############
  c = getch
  if c == 10                  # NewLine
    if valid

      ####### DROP PIECE ##############
      x, z = *ui.split
      vd.send( playerTogV[turn%2], x, 0, z)      # remove the cursor
      0.upto(6 - boardXZ[[x,z]].size) do |y|
        vd.toggle_voxel(x, y, z)
        vd.flush
        sleep(0.4)
        vd.toggle_voxel(x, y, z)
        vd.flush
      end
      finalY = 7 - boardXZ[[x,z]].size
      vd.send( playerSetV[turn%2], x, finalY, z )
      vd.send( playerTogV[turn%2], x, 0, z)      # re-add the cursor 
      vd.flush

      boardXZ[[x,z]] += [turn%2]
      ui = ""
      addstr "\n"

      score_board( boardXZ )

      turn += 1
      nturn = true

    end
  elsif c == 127 or c == 8    # Backspace (linux|windows)
    ui.chop!
  else                        # Any other character
    ui += c
  end

  ####### USER INPUT CHECK ##############
  if (ui.empty?)
    c_color = playerColors[turn%2]
    if valid
      valid = false
      c_send = playerTogV[turn%2]
    end
    if nturn                  # If the turn changed, use previous method type
      nturn = false
      c_send = playerTogV[(turn-1)%2]
    end
  elsif ((/^[0-7]\s[0-7]$/ =~ ui) == nil)
    c_color = COLOR_RED
    if valid
      valid = false
      c_send = playerTogV[turn%2]
    end
  else
    c_color = playerColors[turn%2]
    valid = true
    cursor = [ui.split[0], 0, ui.split[1] ]
    c_send = playerSetV[turn%2]
  end

  ####### OUTPUT TO COMMAND LINE AND DISPLAY ##############
  

  attrset(color_pair(c_color))
  addstr "\r| #{ui}#{" "*(20-ui.size)}:Player #{turn%2}'s turn"

  if c_send != nil
    vd.send( c_send, *cursor )
    c_send = nil
  end
  vd.flush

end
