<?php 

function run_npm_build($type=null,$id=null,$break_cache=null){
    $variables = $type&&$id?"--type=$type --id=$id":'';
    if($break_cache){
        $variables .= " --break_cache=true";
    }
    $cmd = "npm $variables run build_all";
    $root = dirname(__FILE__,2);
    if($_ENV['ENVIRONMENT']=='local'){
        putenv('PATH=' . getenv('PATH') . ';C:\Program Files\nodejs');
        $output=null;
        $retval=null;
        exec('cd '.$root.'/build/ && '.$cmd . '  2>&1 >> '.$root.'/build/tmp/log',$output,$retval);
        return ['output'=>$output,'retval'=>$retval];
    }
    else{
        shell_exec('source /home/takeachisel/nodevenv/public_html/build/16/bin/activate && cd /home/takeachisel/public_html/build && node_modules/.bin/rimraf -g ../public_html/*.html && node_modules/.bin/eleventy 2>&1 >> '.$root.'/build/tmp/log');
    }
}
