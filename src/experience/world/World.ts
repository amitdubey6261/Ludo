import Experience from "../Experience";
import Resources from "../Utils/Resourses";

class World {

    experience : Experience ; 
    scene : THREE.Scene ; 
    resources : Resources ; 

    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ; 
        this.resources = this.experience.resources ;
        console.log( this.resources)
        this.scene.add( this.resources.items.kira.scene ) 
    }

}

export default World ; 