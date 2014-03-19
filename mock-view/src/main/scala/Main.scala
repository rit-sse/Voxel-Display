import processing.core._
import javax.swing.JFrame
import collection.mutable.HashMap
import math._

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

  val voxelHash = new HashMap[(Float, Float, Float), Boolean]()  { override def default(key:(Float, Float, Float)) = false }


  override def setup() = {
    // original setup code here ...
    size(900, 900, PConstants.P3D);
    // prevent thread from starving everything else
    noLoop();


    //PROGRAM
    setVoxel( 3, 3, 3 )
    setVoxel( 3, 3, 4 )
    setVoxel( 3, 4, 3 )
    setVoxel( 4, 3, 3 )
  }

  def voxel(x: Float, y: Float, z: Float, s: Float) = {
    // FRONT
    beginShape()
    vertex(x,   y,   z)       
    vertex(x+s, y,   z)       
    vertex(x+s, y+s, z)       
    vertex(x,   y+s, z)       
    endShape(PConstants.CLOSE)

    // BACK
    beginShape()
    vertex(x,   y,   z+s)    
    vertex(x+s, y,   z+s)    
    vertex(x+s, y+s, z+s)    
    vertex(x,   y+s, z+s)    
    endShape(PConstants.CLOSE)

    // SIDE L
    beginShape()
    vertex(x,   y,   z)     
    vertex(x,   y,   z+s)    
    vertex(x,   y+s, z+s)   
    vertex(x,   y+s, z)  
    endShape(PConstants.CLOSE)

    // SIDE R
    beginShape()
    vertex(x+s, y,   z)     
    vertex(x+s, y,   z+s)    
    vertex(x+s, y+s, z+s)   
    vertex(x+s, y+s, z)  
    endShape(PConstants.CLOSE)
  }


  override def draw() = {
    stroke(0, 0, 0, 0)      // no edges
    translate(80, 80, 40)   // hard-coded centering
    val edge = 8
    for( x <- 1 to edge ) {
      for ( y <- 1 to edge ) {
        for ( z <- 1 to edge ) {
          if ( voxelHash( (x, y, z) ) ) {
            // This is where we draw opaque ones
            fill(15, 15, 155, 200)
          }
          else {
            // This is where we draw clear ones
            fill(15, 15, 15, 5)
          }
          voxel(x*20, y*20, z*20, 20)
        }
      }
    }
  }

  def setVoxel(x: Float, y: Float, z: Float) = {
    if (voxelHash contains (x, y, z))
      voxelHash += (x, y, z) -> !voxelHash(x, y, z)
    else
      voxelHash += (x, y, z) -> true
  }

  override def mousePressed() = {
    // redraw();
  }
}
