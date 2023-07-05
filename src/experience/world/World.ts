import Experience from "../Experience";
import Resources from "../Utils/Resourses";
import TokenSelect from "./Calculations/TokenSelect";
import Tokens from "./Calculations/Tokens";
import IdentifyPath from "./Calculations/IdentifyPath";
import Cannones from "./Cannones";
import * as THREE from 'three';

interface stepType{
    x:number , 
    y: number , 
}

class World {

    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    cannon: Cannones;
    diceMesh: THREE.Group;
    boardMesh: THREE.Group;
    tokens: Tokens ; 
    allTokens : THREE.Mesh[];
    tokenSelect : TokenSelect ;
    identifyPath : IdentifyPath ;
    userTurn : number ;  

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.cannon = new Cannones();
        this.tokens = new Tokens() ; 
        this.allTokens = this.tokens.tokens ; 
        this.tokenSelect = new TokenSelect(this.allTokens) ;
        this.identifyPath = new IdentifyPath(); 
        this.resources = this.experience.resources;


        this.diceMesh = this.resources.items.dice.scene;
        this.scene.add(this.diceMesh);

        this.fsm() ; 
    }

    fsm(){
        this.userTurn = 0 ; 
        let diceRollActive:boolean = false ; 

        const getAllTokenPositionByUser = () =>{
            const allposition:THREE.Vector3[] = [] ; 
            for( let i = 0 ; i<4 ; i++ ){
                allposition.push(this.scene.getObjectByName(`${this.userTurn}${i}`)?.position?? new THREE.Vector3(1,1,1));
            }
            return allposition ; 
        }

        const checkAllTokenInside = (allTokenPosition : THREE.Vector3[]) =>{
            let flag = true ; 
            allTokenPosition.forEach((position)=>{
                if(this.userTurn == 0 ){
                    if( position.x != 3 && position.z !=3  ){
                        return false ; 
                    }
                }
            })
            return flag ; 
        }

        const getDiceValue = () =>{
            this.cannon.throwDice(); 
            return new Promise<number>((resolve)=>{this.cannon.once('DR',(val:number)=>{console.log(val);resolve(val)})});
        }

        const selectToken = () =>{
            return new Promise<THREE.Mesh>((resolve)=>{this.tokenSelect.on("selectedToken" , (e)=>{resolve(e)})});
        }

        const checkSelectedTokenInside = ( e:THREE.Mesh ) =>{
            if( e.position.x == 3 && e.position.z == 3 ){
                return true ; 
            }
            return false ; 
        }

        const selectProperToken = async() =>{
            const selectedToken: THREE.Mesh = await selectToken(); 
            if( checkSelectedTokenInside(selectedToken) ){
                selectProperToken(); 
            }
            return selectedToken ; 
        }

        const oprns = async() =>{

            if( diceRollActive ){
                return ; 
            }

            diceRollActive = true ; 
            const diceValue:number = await getDiceValue();
            const allTokenPosition = getAllTokenPositionByUser();

            if( checkAllTokenInside(allTokenPosition) ){
                if( diceValue != 6 ){
                    diceRollActive = false ; 
                    return ; 
                }
            }

            const selectedToken = await selectProperToken();

            const selectedTokenPath:stepType[] = this.identifyPath.getPath(diceValue, selectedToken.position.x ,selectedToken.position.z);

            this.animateToken( selectedToken , selectedTokenPath );
            diceRollActive = false ; 
        }

        document.addEventListener('dblclick' , oprns );
    }

    animateToken(mesh:THREE.Mesh , path:stepType[]){
        console.log(mesh , path , 'gonzella' );
    }

    upadte() {
        if (this.cannon) {
            this.cannon.update();
            this.diceMesh.position.copy(new THREE.Vector3(this.cannon.diceBody.position.x, this.cannon.diceBody.position.y, this.cannon.diceBody.position.z));
            this.diceMesh.quaternion.copy(new THREE.Quaternion(this.cannon.diceBody.quaternion.x, this.cannon.diceBody.quaternion.y, this.cannon.diceBody.quaternion.z, this.cannon.diceBody.quaternion.w));
        };
    }

}

export default World; 