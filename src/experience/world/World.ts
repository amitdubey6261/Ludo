import Experience from "../Experience";
import Resources from "../Utils/Resourses";
import Cannones from "./Cannones";
import * as THREE from 'three'

class World {

    experience : Experience ; 
    scene : THREE.Scene ; 
    resources : Resources ;
    cannon : Cannones ;
    diceMesh : THREE.Group ;   

    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ; 
        this.cannon = new Cannones() ; 
        this.resources = this.experience.resources ;
        this.initThreeJS(); 
    }
    
    initThreeJS(){
        this.diceMesh = this.resources.items.dice.scene ; 
        this.scene.add( this.diceMesh )
    }

    upadte(){
        if( this.cannon ){
            this.cannon.update();
        } ; 


        this.diceMesh.position.copy( new THREE.Vector3( this.cannon.diceBody.position.x , this.cannon.diceBody.position.y , this.cannon.diceBody.position.z  ));
        this.diceMesh.quaternion.copy( new THREE.Quaternion(this.cannon.diceBody.quaternion.x , this.cannon.diceBody.quaternion.y , this.cannon.diceBody.quaternion.z , this.cannon.diceBody.quaternion.w));
    }

}

export default World ; 