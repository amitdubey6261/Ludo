import * as THREE from 'three' ; 
import Experience from './Experience';
import Sizes from './Utils/Sizes';

export default class Camera{
    experience : Experience ; 
    sizes : Sizes ; 
    scene : THREE.Scene ; 
    canvas : HTMLCanvasElement ; 
    perspectiveCamera : THREE.PerspectiveCamera ; 

    constructor(){
        this.experience  = new Experience() ; 
        this.sizes = this.experience.sizes ; 
        this.scene = this.experience.scene ; 
        this.canvas = this.experience.canvas ; 

        this.createPerspectiveCamera() ;  
    }

    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera( 35 , this.sizes.aspect , 0.1 , 1000) ;
        this.perspectiveCamera.position.set( 0 , 10 , 10 ) ;
        // this.perspectiveCamera.lookAt(new THREE.Vector3( 0 , 0 , 0));
        this.scene.add( this.perspectiveCamera ); 
    }

    resize(){
        this.perspectiveCamera.updateProjectionMatrix();
        this.perspectiveCamera.aspect = this.sizes.aspect;
    }
}