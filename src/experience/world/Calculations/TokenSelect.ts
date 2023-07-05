import * as THREE from 'three' ; 
import Experience from "../../Experience";
import { EventEmitter } from 'events';

class TokenSelect extends EventEmitter{
    experience: Experience;
    scene: THREE.Scene;
    camera : THREE.PerspectiveCamera ; 
    grp : THREE.Group ; 
    pointer : THREE.Vector2 ;
    raycaster : THREE.Raycaster ;  
    selectedObject : any ; 

    constructor( tokens: THREE.Mesh[] ){
        super();
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ;
        this.camera = this.experience.camera.perspectiveCamera ;
        this.grp  = new THREE.Group();  
        this.pointer = new THREE.Vector2 ;
        this.selectedObject = null ;

        tokens.forEach((mesh)=>{
            this.grp.add(mesh);
        })

        this.setEventListner();
        this.initRaycast();


    }

    setEventListner(){
        window.addEventListener('click' , ()=>{
            if( this.selectedObject ){
                this.emit('selectedToken' , this.selectedObject );
            }
        })
    }

    initRaycast(){

        this.scene.add(this.grp)

        console.log(this.grp)

        document.addEventListener( 'pointermove', (event:any)=>{
            if ( this.selectedObject ) {

				this.selectedObject.material.color= new THREE.Color(0xaa00000);
				this.selectedObject.scale.set(1,1,1);
				this.selectedObject = null;

			}
            this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            this.raycaster = new THREE.Raycaster();
            this.raycaster.setFromCamera( this.pointer , this.camera );
            let ins = this.raycaster.intersectObject( this.grp , true );
            if( ins.length > 0 ){
                const res = ins.filter( function ( res ) {
					return res && res.object;

				} )[ 0 ];

				if ( res && res.object ) {

					this.selectedObject = res.object;
                    this.selectedObject.material.color = new THREE.Color(0xffffff);
                    this.selectedObject.scale.set(1.2,1.2,1.2);

				}
            }
        } );

    }
}

export default TokenSelect ; 