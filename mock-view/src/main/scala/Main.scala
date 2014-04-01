import processing.core._
import javax.swing.JFrame
import collection.mutable.HashMap
import math._

object Main{

  def main( args : Array[String] ) = {
    val frame = new JFrame( "Moxel Display (click to rotate view)" )
    frame.setSize( 600, 600 )
    val app = new MoxelDisplay()
    frame.add( app )
    app.init()
    frame.setVisible( true )

    app.redraw()

    val hvd = new HardVoxelDisplay()
    Threads.init( Set(app, hvd) )
  }

}
