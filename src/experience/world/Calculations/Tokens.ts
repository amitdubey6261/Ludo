import Experience from "../../Experience";
import Resources from "../../Utils/Resourses";

class Tokens{
    tokens: THREE.Mesh[] ; //all tokens with meshes and position
    tokenPosition:any[][] ;
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources; 

    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene ; 
        this.resources = this.experience.resources ; 
        
        this.initToken(); 
        this.setTokenToDefaultPosition() ; 
    }

    initToken() {
        const tokens:number[][] = new Array();
        const defaultPosition = [ [3,3] , [3,12] , [11,3] , [11,12] ] ; 
        for (let i = 0; i < 4; i++) {
            const tokenArray:number[] = new Array(4).fill({ position: { x: defaultPosition[i][0], y: defaultPosition[i][1], z: 1 } });
            tokens.push(tokenArray);
        }

        this.tokenPosition = tokens ; 
    }
    
    setTokenToDefaultPosition(){

        let tokenMeshes:THREE.Mesh[] = [] ; 

        this.tokenPosition.forEach((array , i )=>{
            array.forEach(( positioni , j )=>{   
                const tokenMesh = this.resources.items.token.scene.clone().children[0] ;  
                const clonedMaterial = this.resources.items.token.scene.children[0].material.clone() ; 
                tokenMesh.name = `${i}${j}`;
                tokenMesh.position.set( positioni.position.x , 0 , positioni.position.y );
                tokenMesh.material = clonedMaterial  ;
                tokenMeshes.push(tokenMesh);
            })
        })
        
        tokenMeshes.forEach((token)=>{
            this.scene.add(token);
        })

        this.tokens = tokenMeshes ; 
    }
}

export default Tokens ; 