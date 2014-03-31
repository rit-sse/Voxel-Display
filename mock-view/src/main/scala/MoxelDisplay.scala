import processing.core._
import javax.swing.JFrame
import collection.mutable.HashMap
import math._


class MoxelDisplay extends PApplet with VoxelDisplay{

  var voxelSet = Set[Voxel]()

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


  def setVoxels( voxels : Set[Voxel] ) = {
    voxelSet = voxels
  }

  override def setup() = {
    // original setup code here ...
    size(900, 900, PConstants.P3D);

    // prevent thread from starving everything else
    //noLoop();
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

  // return an x-z position around the center, takes the mouse X position
  def cameraXZ() : (Float, Float) = {
    val theta = ( (mouseX toFloat) / (width*0.75 toFloat) ) * (2.0*3.14)
    val r = 300 
    val a = cx
    val b = cy
    val j = (a + r*cos(theta)) toFloat
    val k = (b + r*sin(theta)) toFloat
    val res = (j, k)
    return res
  }

  override def draw() = {
    background(255, 255, 255)
    stroke(0, 0, 0, 0)      // no edges
    fill(55, 155, 55)
    for( x <- List(-1, 8) ) {
      for( y <- List(-1, 8) ) {
        for( z <- List(-1, 8) ) {
          voxel(x*vSize, y*vSize, z*vSize, vSize)
        }
      }
    }

    if (mousePressed) {
      val cXZ = cameraXZ()
      camera(cXZ._1, mouseY-200, cXZ._2, cx, cy, cz, 0, 1, 0)
    }

    //Draw Voxels
    stroke(0, 0, 0, 0)      // no edges
    fill(155, 155, 155, 155)

    voxelSet map { v => 
      voxel(v.x*vSize, v.y*vSize, v.z*vSize, vSize)
    }
  }

  override def mousePressed() = {
    //redraw();
  }
}
