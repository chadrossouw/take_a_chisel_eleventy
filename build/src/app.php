<?php

require_once dirname(__FILE__,2) . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__FILE__,2));
$dotenv->load();
try{
    if(!isset($_SERVER['PHP_AUTH_USER'])||$_SERVER['PHP_AUTH_USER']!==$_ENV['CHISELUSER']||!isset($_SERVER['PHP_AUTH_PW'])){
        throw new Exception('Forbidden');
    };
    
    if ($_ENV['HASH'] != crypt($_SERVER['PHP_AUTH_PW'], $_ENV['HASH'])) { 
        throw new Exception('Forbidden');
    }
}
catch(Exception $e){
    echo '<h2>';
    echo $e->getMessage();
    echo '</h2>';
} 
include './includes.php';
