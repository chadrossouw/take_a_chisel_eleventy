<?php
include './app.php';
try{
   
    $build_all = isset($_POST['build_all'])?$_POST['build_all']:null;
    $type = isset($_POST['type'])?$_POST['type']:null;
    $id = isset($_POST['id'])?$_POST['id']:null;

    if($build_all){
        $return = run_npm_build(null, null, true);
        echo json_encode($return);
    }
    elseif($type&&$id){
        $return = run_npm_build($type,$id);
        echo json_encode($return);
    }
    else{
        throw new Error('You need to specify the build_all parameter or the id and type parameters');
    }
    
}
catch(Exception $e){
    echo $e->getMessage();
}