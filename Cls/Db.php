<?php
/**
 * Created by PhpStorm.
 * User: gonpombo
 * Date: 9/1/14
 * Time: 10:49 AM
 */

class Db {
    private $database = null;
    private static $connection = null;

    private function __construct () {
        $this->connectDB();
    }

    public static function getInstance() {
        if(!self::$connection) {
            self::$connection = new self();
        }
        return self::$connection;
    }

    private function connectDB() {
        $data = parse_ini_file('config/db.ini');
        $hostName = "mysql:host=" . $data["host"] . ";dbname=" . $data["name"];
        try{
            $this->database = new PDO($hostName, $data["user"], $data["pwd"]);
            $this->database->exec("SET NAMES 'utf8';");

        } catch(PDOException $e) {
            die("DB ERROR");
        }
    }

    public function select($table, $columns = " * ", $where = " 1 = 1 ", $data, $paginate = 100) {
        $db = $this->database;
        $columns = ($columns!= " * ") ? implode(",", $columns) : " * ";
        $query = $db->prepare(sprintf("SELECT %s FROM %s WHERE %s LIMIT %s", $columns, $table, $where, $paginate));
        foreach ($data as $key => $value) {
            $query->bindValue(':' . strtolower($key), '%' . urldecode($value). '%', PDO::PARAM_STR);
        }
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }

    public function delete($table, $where) {
        $db = $this->database;
        $res = 0;
        if(isset($where)) {
            $query = $db->prepare(sprintf("DELETE FROM %s WHERE %s", $table, $where));
            $res = $query->execute();
        }
        return json_encode($res);
    }

    public function update($table, $columns, Array $data, $where) {
        $db = $this->database;
        $query = $db->prepare(sprintf("UPDATE %s SET %s WHERE %s", $table, $columns, $where));
        foreach ($data as $key => $value) {
          $query->bindValue(':' . strtolower($key), $value, PDO::PARAM_STR);
        }
        return $query->execute();
    }

    public function insert($table, $columns, $data) {
        $db = $this->database;
        $columns = implode(",", $columns);
        $data = "'".implode("','", $data)."'";
        $a = sprintf("INSERT INTO %s (%s) VALUES (%s)", $table, $columns, $data);
        $query = $db->prepare($a);
        return json_encode($query->execute());
    }

}