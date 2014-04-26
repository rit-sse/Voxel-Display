class HardVoxelDisplay extends VoxelDisplay{

  def setVoxels( voxels : Set[Voxel] ) : Unit = {
    println( voxels );

    // sheets(sheet, y, x)
    val frontSheets = Array.ofDim[Boolean](9, 8, 8)
    val sideSheets = Array.ofDim[Boolean](9, 8, 8)

    for( v <- voxels ) {
      frontSheets(v.y)(7-v.z)(v.x)  = !frontSheets(v.y)(7-v.z)(v.x)
      frontSheets(v.y+1)(7-v.z)(v.x)  = !frontSheets(v.y+1)(7-v.z)(v.x)
      sideSheets(v.x)(7-v.z)(7-v.y)   = !sideSheets(v.x)(7-v.z)(7-v.y)
      sideSheets(v.x+1)(7-v.z)(7-v.y)   = !sideSheets(v.x+1)(7-v.z)(7-v.y)
    }

    println( "Creating Final ByteString" );
    var sendLine = ""
    var debugList = Array("", "")
    var sheetList = Array(frontSheets, sideSheets)
    for( listIndex <- Array(0, 1) ) {
      for( sheet <- sheetList(listIndex) ) {
        for( row <- sheet ) {
          val intRow = row.map { if(_) '1' else '0' }
          debugList(listIndex) += intRow.mkString("")+"\n"
          sendLine += intRow.mkString("")
        }
      }
    }

    // Print Debug Sheets

    // HORIZONTAL PRINT
    val label = Array("FRONT SHEETS (origin - bottom left front)", "SIDE SHEETS (origin - bottom right front)")
    for( i <- Array(0, 1) ) {
      println( label(i) )
      for( j <- Range(0, 8) ) {
        for( k <- Range(0, 9) ) {
          print( debugList(i).split("\n")((k*8)+j) + " " )
        }
        println("")
      }
    }

    /*
    // VERTICAL PRINT
    for( l <- Range(0, debugList(0).split("\n").length) ) {
      println( debugList(0).split("\n")(l) + "\t\t" + 
                   debugList(1).split("\n")(l) )
      if ( ((l+1)%8) == 0 ) {
        println("")
      }
    }
    */

  }

}
