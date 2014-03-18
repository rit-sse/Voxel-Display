import processing.core._
import javax.swing.JFrame

object Main{

  def main( args : Array[String] ) = {
    val frame = new JFrame( "Herp" )
    frame.setSize( 400, 400 )
    val app = new Embedded()
    frame.add( app )
    app.init()
    frame.setVisible( true )
  }

}



class Embedded extends PApplet {

  override def setup() = {
    // original setup code here ...
    size(400, 400, PConstants.P3D);

    // prevent thread from starving everything else
    noLoop();
  }

  override def draw() = {
    fill(155, 0, 0)
    box( 60, 60, 20 )
    fill(0, 130, 0)
    translate(100, 100, 00)
    box( 60, 60, 20 )
  }

  override def mousePressed() = {
    // redraw();
  }
}
