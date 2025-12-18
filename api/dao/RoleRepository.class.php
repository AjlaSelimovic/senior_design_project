<?php

require_once __DIR__.'/BaseRepository.class.php';

class RoleRepository extends BaseRepository {

    public function __construct() {
        parent::__construct("roles");
    }

    public function get_role_by_name($name) {
        return $this->query_unique(
            "SELECT * FROM roles WHERE name = :name",
            ['name' => $name]
        );
    }

    public function get_role_by_id($id) {
        return $this->query_unique(
            "SELECT * FROM roles WHERE id = :id",
            ['id' => $id]
        );
    }

    public function get_all_roles() {
        return $this->query_without_params("SELECT * FROM roles");
    }
}
?>
