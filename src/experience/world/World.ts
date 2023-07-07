import Experience from "../Experience";
import Resources from "../Utils/Resourses";
import TokenSelect from "./Calculations/TokenSelect";
import Tokens from "./Calculations/Tokens";
import IdentifyPath from "./Calculations/IdentifyPath";
import Cannones from "./Cannones";
import * as THREE from 'three';
import Animate from "./Calculations/Animate";

class World {

    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    cannon: Cannones;
    diceMesh: THREE.Group;
    boardMesh: THREE.Group;
    tokens: Tokens;
    allTokens: THREE.Mesh[];
    tokenSelect: TokenSelect;
    identifyPath: IdentifyPath;
    userTurn: number;
    mesh : THREE.Mesh ; 
    co : any ; 
    animate : Animate ; 

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.initGameAssets();
        this.addVisuals();
        this.setEventListners();
    }

    initGameAssets() {
        this.cannon = new Cannones();
        this.tokens = new Tokens();
        this.animate = new Animate() ; 
        this.allTokens = this.tokens.tokens;
        this.tokenSelect = new TokenSelect(this.allTokens);
        this.identifyPath = new IdentifyPath();

        this.userTurn = 0;
    }

    addVisuals() {
        this.diceMesh = this.resources.items.dice.scene;
        this.scene.add(this.diceMesh);
    }

    setEventListners() {
        window.addEventListener('dblclick', this.engine.bind(this));
    }

    //gameengine
    async engine() {
        // const value = await this.throwDice();
        const value = 6  ; 

        if (value != 6) {
            if (this.checkAllTokenInside()) {
                alert('your all token inside have 6 to open');
                return;
            }
        }

        const slectToken = async() =>{
            try{
                const token:THREE.Mesh = await this.tokenSelect.getToken(value == 6 ? true : false ) as THREE.Mesh ;
                const path = this.identifyPath.getPath(value , token.position.x , token.position.z ) ;

            }
            catch{
                slectToken();
            }
        }

        slectToken();
    }

    async throwDice() {
        this.cannon.throwDice();
        const diceValue: number = await this.cannon.diceCalc();
        return diceValue;
    }

    checkAllTokenInside() {
        const defaultTokenPosition = [[3, 3], [3, 12], [11, 3], [11, 12]];
        for (let i = 0; i < 4; i++) {
            const token = this.scene.getObjectByName(`${this.userTurn}${i}`);
            const posX = token?.position.x;
            const posY = token?.position.z;
            if (posX != defaultTokenPosition[this.userTurn][0] || posY != defaultTokenPosition[this.userTurn][1]) {
                return false;
            }
        }
        return true;
    }

    upadte() {
        if (this.cannon) {
            this.cannon.update();
            this.diceMesh.position.copy(new THREE.Vector3(this.cannon.diceBody.position.x, this.cannon.diceBody.position.y, this.cannon.diceBody.position.z));
            this.diceMesh.quaternion.copy(new THREE.Quaternion(this.cannon.diceBody.quaternion.x, this.cannon.diceBody.quaternion.y, this.cannon.diceBody.quaternion.z, this.cannon.diceBody.quaternion.w));
        };
        if( this.identifyPath )this.identifyPath.update();
    }

}

export default World; 