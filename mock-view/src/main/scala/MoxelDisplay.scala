import processing.core._
import javax.swing.JFrame
import collection.mutable.HashMap
import math._
import language.postfixOps


class MoxelDisplay extends PApplet with VoxelDisplay{

  var voxelSet = Set[Voxel]()
  var frontSheets = Array.ofDim[Boolean](9, 8, 8)
  var sideSheets = Array.ofDim[Boolean](9, 8, 8)

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
    frontSheets = Array.ofDim[Boolean](9, 8, 8)
    sideSheets = Array.ofDim[Boolean](9, 8, 8)     
    for( v <- voxels ) {
        frontSheets(v.y)(7-v.z)(v.x)  = !frontSheets(v.y)(7-v.z)(v.x)
        frontSheets(v.y+1)(7-v.z)(v.x)  = !frontSheets(v.y+1)(7-v.z)(v.x)
        sideSheets(v.x)(7-v.z)(7-v.y)   = !sideSheets(v.x)(7-v.z)(7-v.y)
        sideSheets(v.x+1)(7-v.z)(7-v.y)   = !sideSheets(v.x+1)(7-v.z)(7-v.y)
    }
  }

  override def setup() = {
    // original setup code here ...
    size(900, 900, PConstants.P3D);

    // prevent thread from starving everything else
    //noLoop();
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
    background(255, 255, 255);

    fill(155, 155, 155, 0);     // no fill
    stroke(155, 155, 155);
    val diameter = 8*vSize
    val radius = 4*vSize

    translate(radius, diameter+10, radius)
    box(diameter, 20, diameter);
    translate(-radius, -(diameter+10), -radius)

    if (mousePressed) {
      val cXZ = cameraXZ();
      camera(cXZ._1, mouseY-200, cXZ._2, cx, cy, cz, 0, 1, 0);
    }

    //Draw Voxels
    stroke(0, 0, 0, 0);      // no edges
    fill(155, 155, 155, 155);

    val s = vSize
    // FRONT SHEETS
    for( (fsy, fy) <- frontSheets.view.zipWithIndex ) {
        for( (fsz, fz) <- fsy.view.zipWithIndex ) {
            for( (fsx, fx) <- fsz.view.zipWithIndex ) {
              if (fsx) {
                val x = fx*s
                val z = (8-fy)*s     // Y and Z are flipped in our model
                val y = fz*s         // Y and Z are flipped in our model
                beginShape()
                vertex(x,   y,   z)
                vertex(x+s, y,   z)
                vertex(x+s, y+s, z)
                vertex(x,   y+s, z)
                endShape(PConstants.CLOSE)
              }
           }
        }
    }

    // SIDE SHEETS
    for( (fsx, fx) <- sideSheets.view.zipWithIndex ) {
        for( (fsz, fz) <- fsx.view.zipWithIndex ) {
            for( (fsy, fy) <- fsz.view.zipWithIndex ) {
              if (fsy) {
                val x = fx*s
                val z = fy*s     // Y and Z are flipped in our model
                val y = fz*s         // Y and Z are flipped in our model
                beginShape()
                vertex(x,   y,   z)
                vertex(x,   y,   z+s)
                vertex(x,   y+s, z+s)
                vertex(x,   y+s, z)
                endShape(PConstants.CLOSE)
              }
           }
        }
    }

  }

  override def mousePressed() = {
    //redraw();
  }
}
