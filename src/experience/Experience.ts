import * as THREE from 'three' ; 
import Time from './Utils/Time';
import Sizes from './Utils/Sizes';
import Camera from './Camera';
import Renderer from './Rednderer';
import Resources from './Utils/Resourses';
import AssetsArray from './Utils/Assets';
import Helper from './Helper';
import Controllers from './Controller';
import World from './world/World';
import Environment from './world/Environment';

import {io , Socket } from 'socket.io-client' ; 

export default class Experience{ 
    static instance: Experience; 
    canvas : HTMLCanvasElement ;
    scene : THREE.Scene ; 
    time : Time ;
    sizes : Sizes ; 
    camera : Camera ; 
    renderer : Renderer ; 
    resources : Resources ;
    helpers : Helper  ; 
    controllers : Controllers ; 
    world : World ;
    environement : Environment ;  
    socket : Socket ;
    
    constructor(canvas?: HTMLCanvasElement ){
        if( Experience.instance ){
            return Experience.instance ; 
        }
        else{
            if( canvas != undefined){
                this.canvas = canvas ; 
            }
            Experience.instance = this ; 
            this.scene = new THREE.Scene() ; 
            this.sizes = new Sizes() ; 
            this.time = new Time() ; 
            this.camera = new Camera() ; 
            this.renderer = new Renderer() ; 
            this.resources = new Resources( AssetsArray ) ; 
            this.helpers = new Helper();
            this.controllers = new Controllers() ; 

            this.sizes.on('resize' , ()=>{
                this.resize() ; 
            })

            this.time.on('update' , ()=>{
                this.update() ; 
            })

            this.resources.on('ready' , ()=>{
                this.socket = io('http://localhost:5000') ; 

                this.socket.emit('HELLO') ; 

                this.world = new World() ; 
                this.environement = new Environment() ;
            })

        }
    }

    resize(){
        this.camera.resize() ; 
        this.renderer.resize();
    }

    update(){
        this.renderer.update();
        if( this.controllers ) this.controllers.update() ;
        if( this.world ) this.world.upadte() ;  
    }
}