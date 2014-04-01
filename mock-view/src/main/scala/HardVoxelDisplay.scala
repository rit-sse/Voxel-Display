class HardVoxelDisplay extends VoxelDisplay{

  def setVoxels( voxels : Set[Voxel] ) : Unit = {
    println( voxels );

    // sheets(sheet, row, col)
    val frontSheets = Array.ofDim[Boolean](8, 8, 8)
    val sideSheets = Array.ofDim[Boolean](8, 8, 8)

    for( v <- voxels ) {
      frontSheets(v.z)(v.x)(v.y)    = !frontSheets(v.z)(v.x)(v.y)
      frontSheets(v.z+1)(v.x)(v.y)  = !frontSheets(v.z+1)(v.x)(v.x)
      sideSheets(v.x)(7-v.z)(v.y)   = !sideSheets(v.x)(7-v.z)(v.y)
      sideSheets(v.x+1)(7-v.z)(v.y) = !sideSheets(v.x+1)(7-v.z)(v.y)
    }

    println( "Creating Final ByteString" );
    var line = ""
    for( sheet <- frontSheets ) {
      for( row <- sheet ) {
        println( row.mkString("|") );
        line += row.mkString("")
      }
    }
  }

}
