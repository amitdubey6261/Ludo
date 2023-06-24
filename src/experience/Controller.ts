import * as THREE from 'three' ; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' ; 

import Experience from "./Experience";
import Sizes from './Utils/Sizes';
import Renderer from './Rednderer';
import Camera from './Camera';

class Controllers{
    experience : Experience ; 
    scene : THREE.Scene ; 
    canvas : HTMLCanvasElement ;
    sizes : Sizes ; 
    renderer : Renderer ; 
    camera : Camera ; 
    orbitControls : OrbitControls ; 

    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ; 
        this.canvas = this.experience.canvas ; 
        this.camera = this.experience.camera  ; 
        this.renderer = this.experience.renderer ; 
        this.sizes = this.experience.sizes ; 

        this.createControlls() ; 
    }
    
    createControlls(){
        this.createOrbitControlls() ; 
    }

    createOrbitControlls(){
        this.orbitControls = new OrbitControls( this.camera.perspectiveCamera , this.canvas);
        this.orbitControls.enableDamping = true ; 
        this.orbitControls.enableZoom = true ; 
        this.orbitControls.enableRotate = true ; 
    }

    update(){
        this.orbitControls.update();
    }
}

export default Controllers ; 