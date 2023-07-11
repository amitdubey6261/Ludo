import Experience from "../Experience";
import Resources from "../Utils/Resourses";
import TokenSelect from "./Calculations/TokenSelect";
import Tokens from "./Calculations/Tokens";
import IdentifyPath from "./Calculations/IdentifyPath";

import Cannones from "./Cannones";
import * as THREE from 'three';
import * as CANNON from 'cannon-es' ; 
import uniqid from 'uniqid' ; 

import Animate from "./Calculations/Animate";
import { defaultPosition } from "../Static";
import { Socket } from "socket.io-client";

//interfaces 

interface diceData{
    position: CANNON.Vec3 , 
    quaternion : CANNON.Quaternion , 
}

class World {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    cannon: Cannones;
    diceMesh: THREE.Group;
    tokens: Tokens;
    allTokens: THREE.Mesh[];
    tokenSelect: TokenSelect;
    identifyPath: IdentifyPath;
    animate : Animate ; 
    userTurn : number ; 
    multiplayer : boolean ;
    socket : Socket ;
    room : string ; 

    constructor() {
        this.multiplayer = false ; 
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.socket = this.experience.socket ; 

        this.activateGameType() ; 
    }

    activateGameType(){
        if(!this.multiplayer){
            this.initSimpleGame() ; 
        }
        else{
            this.initMultiplayer();
        }
    }

    initSimpleGame(){
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

    async engine() {
        // let Dicevalue:number = Number(prompt('Enter number')) ; 
        const Dicevalue = await this.throwDice();
        console.log('dice : ' , Dicevalue );

        if (Dicevalue != 6) {
            if (this.checkAllTokenInside()) {
                alert('your all token inside have 6 to open');
                this.userTurn += 1 ; 
                this.userTurn %= 4 ; 
                return;
            }
        }

        const slectToken = async() =>{
            try{
                const token:THREE.Mesh = await this.tokenSelect.getToken(Dicevalue == 6 ? true : false , this.userTurn ) as THREE.Mesh ;
                const path = this.identifyPath.getPath(Dicevalue , token.position.x , token.position.z ) ;
                let ate : boolean|unknown ; 
                try{ate = await this.animate.animateTokenAndCheckAte(token , path);}catch(e){ate = e ;}

                if(Dicevalue == 6 || ate == true ){
                    console.log('chance again');
                    return  ; 
                }

                this.userTurn += 1 ; 
                this.userTurn %= 4 ; 
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
        const defaultTokenPosition = defaultPosition();
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
    
    //-----------------------------------------------------------------------------------------------------------------------------------------------

    initMultiplayer(){
        const value:number = Number(prompt('Enter Number of Players')) ; 

        if( value ? value > 4 : false ){
            alert('Enter in range 1 - 4 ') ; 
            this.initMultiplayer() ; 
        }

        const value2:number = Number(prompt('Enter Room or join room  0/1')) ; 

        if( value2 == 0 ){
            this.createRoom() ; 
        }
        else if( value2 ==1 ){
            this.joinRoom() ; 
        }
        else{
            alert('wrong I/P') ; 
            this.initMultiplayer();
        }

        this.socket.on('Error' , (e)=>{
            alert('Error'+e) ; 
            setTimeout(()=>{
                location.reload() ;  
            } , 10000 )
        })
        
    }

    createRoom(){
        const roomid = uniqid() ; 

        this.socket.emit('create_room' , roomid ) ; 

        this.socket.on('created_room', (roomid)=>{
            this.room = roomid ; 
            console.log(`inited ${this.room}`);
            this.InRoom();
        })
    }

    joinRoom(){
        const roomid = prompt('Enter Room wanted to join') ; 
        this.socket.emit('join_room' , roomid ); 
        this.socket.on('joined_room' , (roomid)=>{
            this.room = roomid ; 
            console.log('joined_room' , roomid ) ; 
            this.InRoom();
        })
    }

    InRoom(){
        this.cannon = new Cannones(this.room);
        this.tokens = new Tokens();
        this.animate = new Animate() ;
        this.allTokens = this.tokens.tokens;
        this.tokenSelect = new TokenSelect(this.allTokens);
        this.identifyPath = new IdentifyPath();

        this.userTurn = 0 ; 

        this.diceMesh = this.resources.items.dice.scene;
        this.scene.add(this.diceMesh);

        window.addEventListener('dblclick', this.MultiplayerEngine.bind(this));
    }

    async MultiplayerEngine(){
        const dicevalue = await this.throwDice() ; 
    }

    upadte() {
        if (this.cannon) {
            this.cannon.update();
            this.diceMesh.position.copy(new THREE.Vector3(this.cannon.diceBody.position.x, this.cannon.diceBody.position.y, this.cannon.diceBody.position.z));
            this.diceMesh.quaternion.copy(new THREE.Quaternion(this.cannon.diceBody.quaternion.x, this.cannon.diceBody.quaternion.y, this.cannon.diceBody.quaternion.z, this.cannon.diceBody.quaternion.w));
        };
        // if( this.identifyPath )this.identifyPath.update();
        if(this.animate) this.animate.update() ; 
    }

}

export default World; 