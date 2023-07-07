import * as THREE from 'three' ; 
import * as YUKA from 'yuka' ; 

import Experience from "../../Experience";

export default class Animate{
    experience : Experience ; 
    scene : THREE.Scene ; 

    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ; 
    }

    animateToken(){
        
    }

    makePathVisibe(){

    }
}