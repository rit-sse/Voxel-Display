import java.net._
import scala.io.Source;

object Threads {


  def init( moxel : Embedded )  = {
    val ssock =  new ServerSocket(8999)

    while( true ) {
      val clisock = ssock.accept()
      println( "Accepted a socket" )
      val ostream = clisock.getOutputStream
      val istream = Source.fromInputStream(  clisock.getInputStream )

      val lineIterator = istream.getLines

      for( l <- istream.getLines ) {
          // Send line to blink set
          if ( l slice (0, 1) matches "b" ) {
              parseLine(l drop 1) match {
                case Some(s) => moxel.setBlinkVoxels( s )
                case None =>  Unit
              }
          }
          // Send line to normal set
          else {
              parseLine(l) match {
                case Some(s) => moxel.setVoxels( s )
                case None =>  Unit
              }
          }
      }

      println( "Ran out of lines" )
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
