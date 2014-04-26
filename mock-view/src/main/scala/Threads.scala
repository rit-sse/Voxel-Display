import java.net._
import scala.io.Source;
import language.postfixOps

object Threads {


  def init( displays : Set[VoxelDisplay] )  = {
    val ssock =  new ServerSocket(8999)

    while( true ) {
      println( "Waiting for a socket connection" )
      val clisock = ssock.accept()
      println( "Accepted a socket" )
      val ostream = clisock.getOutputStream
      val istream = Source.fromInputStream(  clisock.getInputStream )

      val lineIterator = istream.getLines

      for( l <- istream.getLines ) {
          parseLine(l) match {
              case Some(s) => displays.foreach { d => d.setVoxels(s) }
              case None =>  Unit
          }
      }

      println( "Received EOF, terminating socket" )
      clisock.close()

    }
  }



  def parseLine( line : String ) : Option[Set[Voxel]] = {
    if (line.size == 0) {
      Some(Set())
    }
    else if( ! line.matches ( "(\\d \\d \\d)(,(\\s?)\\d \\d \\d)*" ) ) {
      println( "Malformed line" ); None
    }
    else {
      Some((line split ",")
        .map { s => s.trim}
        .map { triple =>
          val nums = triple split " "
          Voxel( nums( 0 ) toInt, nums(1) toInt, nums(2) toInt)
        } toSet)
    }

  }





}
