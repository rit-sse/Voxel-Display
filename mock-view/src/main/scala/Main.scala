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

  var star: PShape = createShape()

  override def setup() = {
    // original setup code here ...
    size(400, 400, PConstants.P3D);

    // prevent thread from starving everything else
    noLoop();

    star.beginShape()
    // You can set fill and stroke
    star.fill(102)
    star.stroke(255)
    star.strokeWeight(2)
    // Here, we are hardcoding a series of vertices
    star.vertex(0, -50)
    star.vertex(14, -20)
    star.vertex(47, -15)
    star.vertex(23, 7)
    star.vertex(29, 40)
    star.vertex(0, 25)
    star.vertex(-29, 40)
    star.vertex(-23, 7)
    star.vertex(-47, -15)
    star.vertex(-14, -20)
    star.endShape(PConstants.CLOSE)
  }

  override def draw() = {
    fill(155, 0, 0)
    translate(120, 120, 00)
    shape(star)

    fill(0, 130, 0)
    translate(100, 100, 00)
    box( 60, 60, 20 )
  }

  override def mousePressed() = {
    // redraw();
  }
}
