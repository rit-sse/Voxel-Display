import processing.core._
import javax.swing.JFrame
import collection.mutable.HashMap
import math._

object Main{

  def main( args : Array[String] ) = {
    val frame = new JFrame( "Moxel Display (click to rotate view)" )
    frame.setSize( 600, 600 )
    val app = new Embedded()
    frame.add( app )
    app.init()
    frame.setVisible( true )

    app.redraw()


    Threads.init( app )
  }

}
