import processing.core._
import javax.swing.JFrame
import collection.mutable.HashMap
import math._

object Main{

  def main( args : Array[String] ) = {
    val frame = new JFrame( "Moxel Display" )
    frame.setSize( 400, 400 )
    val app = new Embedded()
    frame.add( app )
    app.init()
    frame.setVisible( true )

    Threads.init( app )
  }

}
