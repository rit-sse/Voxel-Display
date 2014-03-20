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
  }

}



class Embedded extends PApplet {

  val voxelHash = new HashMap[(Float, Float, Float), Boolean]()  { override def default(key:(Float, Float, Float)) = false }

  val vEdge = 8     // max number of voxels in any one direction
  val vSize = 20    // size of voxels
  val ex = width/2 toFloat
  val ey = height/2 toFloat
  val ez = vSize*15
  val cx = vSize*(vEdge/2)
  val cy = vSize*(vEdge/2)
  val cz = vSize*(vEdge/2)
  val ux = 0
  val uy = 1
  val uz = 0


  override def setup() = {
    // original setup code here ...
    size(900, 900, PConstants.P3D);

    // prevent thread from starving everything else
    //noLoop();


    //PROGRAM

    //  Draw Corners
    setVoxel( 0, 0, 0 )
    setVoxel( 0, 0, 8 )
    setVoxel( 0, 8, 0 )
    setVoxel( 0, 8, 8 )
    setVoxel( 8, 0, 0 )
    setVoxel( 8, 0, 8 )
    setVoxel( 8, 8, 0 )
    setVoxel( 8, 8, 8 )

    //  Draw Shape
    setVoxel( 3, 3, 3 )
    setVoxel( 3, 3, 4 )
    setVoxel( 3, 4, 3 )
    setVoxel( 4, 3, 3 )

    setVoxel( 3, 3, 6 )
    setVoxel( 3, 3, 8 )

    setVoxel( 6, 3, 3 )
    setVoxel( 8, 3, 3 )

    setVoxel( 3, 6, 3 )
    setVoxel( 3, 8, 3 )

    setVoxel( 3, 3, 3 )
  }

  def voxel(x: Float, y: Float, z: Float, s: Float, a: Float) = {
    fill(155, 155, 155, a)
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

  // return an x-z position around the center, takes the mouse X position
  def cameraXZ() : (Float, Float) = {
    val theta = ( (mouseX toFloat) / (width*0.75 toFloat) ) * (2.0*3.14)
    val r = 400 
    val a = cx
    val b = cy
    val j = (a + r*cos(theta)) toFloat
    val k = (b + r*sin(theta)) toFloat
    val res = (j, k)
    return res
  }

  override def draw() = {
    background(255, 255, 255)
    val cXZ = cameraXZ()
    camera(cXZ._1, mouseY-200, cXZ._2, cx, cy, cz, 0, 1, 0)

    //Draw Voxels
    stroke(0, 0, 0, 0)      // no edges
    for ( (x, y, z) <- voxelHash keys ) {
      if (voxelHash((x, y, z)))
        voxel(x*vSize, y*vSize, z*vSize, vSize, 155)
    }
  }

  def setVoxel(x: Float, y: Float, z: Float) = {
    if (voxelHash contains (x, y, z))
      voxelHash += (x, y, z) -> !voxelHash(x, y, z)
    else
      voxelHash += (x, y, z) -> true
  }

  override def mousePressed() = {
    //redraw();
  }
}
