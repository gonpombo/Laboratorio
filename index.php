<?php

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
        update($data, $id, $database, "PELICULAS");
      } else if($method == 'GET') {
        isset($params) ? $params : $params = 'page=1';
        get($params, $database, "PELICULAS");
      } else {
        echo $method;
      }
      break;

    case 'actors': 
      if($method == 'POST') {
        update($data, $id, $database, "ACTORES");
      } else if($method == 'GET') {
        isset($params) ? $params  : $params = 'page=1';
        get($params, $database, "ACTORES");
      } else {
        echo $method;
      }
      break;
    case 'directors': 
      if($method == 'POST') {
        update($data, $id, $database, "DIRECTORES");
      } else if($method == 'GET') {
        isset($params) ? $params  : $params = 'page=1';
        get($params, $database, "DIRECTORES");
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

    case 'movieActor':
      if($method == 'GET') {
        isset($params) ? $params : $params = "id=0";
        $params = explode("=", $params);
        getMovieActor($params[1], $database); 
      }
      break;

    case 'directorMovie':
      if($method == 'GET') {
        isset($params) ? $params : $params = "id=0";
        $params = explode("=", $params);
        getDirectorMovie($params[1], $database); 
      }
      break;

      default:
        require 'index.html';
        break;
  }
}

function get($params, $db, $table) {
  $columns = [];
  $data = [];
  $params = explode("&", $params);
  foreach ($params as $key => $value) {
    $aux = explode("=", $value);
    if($aux[0] == 'page') {
      $page = ($aux[1] - 1) * 10;
      $paginate = $page . " ," . 20;
      unset($params[$key]);
      break;
    }
  }
  foreach ($params as $key => $value) {
    $aux = explode("=", $value);
    $data[$aux[0]] = $aux[1];
    array_push($columns, strtolower($aux[0]) . " LIKE :" . strtolower($aux[0]));
  }
  $params = implode(' AND ', $columns);
  if($params == "") {
    $params = "1 = 1";
  }
  echo $db->select($table, ' * ', $params, $data, $paginate);
}

function update($data, $id, $db, $table) {
  $where = "id=" . $id;
  $columns = [];
  foreach ($data as $key => $value) {
    array_push($columns, strtolower($key) . "= :" . strtolower($key));
  }
  $columns = implode(', ', $columns);
  $res = $db->update($table, $columns, $data, $where);
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

function getMovieActor($params, $db) {
  $columns = ["a.NOMBRE", "a.APELLIDO", "a.SEXO"];
  $table = "ACTORES AS a, ACTORES_PELICULAS AS p";
  $where = "p.ID_PELICULA=" . $params . " AND p.ID_ACTOR=a.ID";
  echo $db->select($table, $columns, $where);
}

function getDirectorMovie($params, $db) {
  $columns = ["p.NOMBRE", "p.ANIO"];
  $table = "DIRECTORES_PELICULAS AS a, PELICULAS AS p";
  $where = "a.ID_DIRECTOR=" . $params . " AND p.ID=a.ID_PELICULA";
  echo $db->select($table, $columns, $where);
}


parseRoute($_SERVER['REQUEST_URI']);
