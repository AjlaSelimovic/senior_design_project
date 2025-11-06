<?php

abstract class BaseService{

    protected $repository;

    public function __construct($repository){
        $this->repository = $repository;
    }

    public function get_all(){
        return $this->repository->get_all();
    }

    public function get_by_id($id){
        return $this->repository->get_by_id($id);
    }

    public function add_element($entity){
        return $this->repository->add_element($entity);
    }

    public function update_element($id, $entity){
        return $this->repository->update_element($id, $entity);
    }

    public function delete_element($id){
        return $this->repository->delete_element($id);
    }
}
?>