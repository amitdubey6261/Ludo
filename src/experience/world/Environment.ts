import Experience from "../Experience";
import * as THREE from 'three' ;

class Environment{
    experience : Experience ; 
    scene : THREE.Scene ; 
    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ;
        
        this.setEnvLight() ; 
    }

    setEnvLight(){
        const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xff0000 , 2) ; 
        const light2: THREE.DirectionalLight = new THREE.DirectionalLight(0x00ff00 , 2) ; 
        const light3: THREE.DirectionalLight = new THREE.DirectionalLight(0x00ffff , 2) ; 
        const light4: THREE.DirectionalLight = new THREE.DirectionalLight(0xff00ff , 2) ; 
        light.position.set( 10 , 10 , 0 ) ;
        light2.position.set( 0 , 10 , 10 ) ;
        light3.position.set( -10 , 0 , -10 ) ;
        light4.position.set( 0 , -10 , 0 ) ;
        this.scene.add( light ) ;  
        this.scene.add( light2 ) ;  
        this.scene.add( light3 ) ;  
        this.scene.add( light4 ) ;  
    }
}

export default Environment ; 