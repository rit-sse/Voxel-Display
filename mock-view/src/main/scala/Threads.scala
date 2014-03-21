import java.net._
import scala.io.Source;

object Threads {


  def init( moxel : Embedded )  = {
    val ssock =  new ServerSocket(8999)
    val clisock = ssock.accept()
    println( "Accepted a socket" )
    val ostream = clisock.getOutputStream
    val istream = Source.fromInputStream(  clisock.getInputStream ) 

    val lineIterator = istream.getLines

    for( l <- istream.getLines ) {
        moxel.setVoxels( parseLine(l) )
        // moxel.setVoxels( Set(Voxel(0,0,0), Voxel(0, 1, 1) ) )
    }

  }



  def parseLine( line : String ) : Set[Voxel] = {
    (line split ",")
      .map { s => s.trim}
      .map { triple =>
        val nums = triple split " "
        Voxel( nums( 0 ) toInt, nums(1) toInt, nums(2) toInt) 
      } toSet

  }





}
