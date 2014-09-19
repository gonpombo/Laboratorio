<?php

//
//echo $database->delete("movies", "id=7");
//echo $database->update("movies", "name='EzeBoton'", 'id=4');
//echo $database->insert("movies", ["name", "description"], ["juan", "malisima"]);
function parseRoute($x) {
  include "Cls/Db.php";
  $database = Db::getInstance();
  $uri = parse_url($x);
  $method = $_SERVER["REQUEST_METHOD"];
  $path = split('/', $uri["path"])[1];
  $id = split('/', $uri["path"])[2];
  $params = $uri["query"];
  $data = json_decode($_POST["data"], true);
  switch ($path) {
	  case 'movies':
      if($method == 'POST') {
        postMovie($data, $database);
      } else if($method == 'GET') {
        isset($params) ?  getMovieParam((int) $params, $database) : getMovie($database);
      } else if($method == 'DELETE') {
        if((int)$params) {
          deleteMovie($database, $params);
        } else {
          echo "Error";
        }
      } else {
        echo $method;
      }
      break;

    case 'actors': 
      if($method == 'POST') {
        updateActor($data, $id, $database);
      } else if($method == 'GET') {
        isset($params) ? $params  : $params = 'page=1';
        getActor($params, $database);
      } else {
        echo $method;
      }
      break;

    case 'actorMovie':
      if($method == 'GET') {
        isset($params) ? $params : $params = "id=0";
        $params = explode("=", $params);
        getActorMovie($params[1], $database);
      }
      break;

      default:
        echo $path;
        require 'index.html';
        break;
  }
}

function getActor($params, $db) {
  $params = explode("&", $params);
  foreach ($params as $key => $value) {
    $aux = explode("=", $value);
    if($aux[0] == 'page') {
      $page = ($aux[1] - 1) * 10;
      $paginate = $page . " ," . 20;
    }
    unset($params[$key]);
  }
  $params = implode(' AND ', $params);
  if($params == "") {
    $params = "1 = 1";
  }
  echo $db->select("ACTORES", ' * ', $params, $paginate);
}

function updateActor($data, $id, $db) {
  $where = "id=" . $id;
  $columns = [];
  $values = [];
  foreach ($data as $key => $value) {
    array_push($columns, strtolower($key) . "= :" . strtolower($key));
  }
  $columns = implode(', ', $columns);
  $res = $db->update("ACTORES", $columns, $data, $where);
  if($res == "true") {
    $res = $data;
  } else {
    $res = false;
  }
  echo json_encode($res);
}

function getActorMovie($params, $db) {
  $columns = ["a.PERSONAJE", "p.NOMBRE", "p.ANIO"];
  $table = "ACTORES_PELICULAS AS a, PELICULAS AS p";
  $where = "a.ID_ACTOR=" . $params . " AND p.ID=a.ID_PELICULA";
  echo $db->select($table, $columns, $where);

}

function getMovie($db){
    echo $db->select("movies");
}

function getMovieParam($id, $db) {
    echo $db->select("movies", " * ", "id=".$id);
}

function postMovie($data, $db) {
    $columns = ["name", "description", "director", "year", "rating"];
    $postData = [];
    foreach($columns as $c) {
        array_push($postData, $data[$c]);
    }
    echo $db->insert("movies", $columns, $postData);
}

function deleteMovie($db, $id) {
    echo $db->delete("movies", 'id='.$id);
}


parseRoute($_SERVER['REQUEST_URI']);
