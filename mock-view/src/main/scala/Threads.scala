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
        println ( l );
    }

  }


}
