import * as CANNON from 'cannon-es';
import Experience from '../Experience';
import CannonDebugger from 'cannon-es-debugger';
import { EventEmitter } from 'events';
import { Socket } from 'socket.io-client';

interface diceDataType{
    quaternion : CANNON.Quaternion , 
    position : CANNON.Vec3 , 
    room : string|undefined  , 
}

class Cannones extends EventEmitter {
    experience: Experience;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    world: CANNON.World;
    CDebg: any;
    timeStep: number;
    diceBody: CANNON.Body;
    groundBody: CANNON.Body;
    diceResult: number;
    diceState : boolean ; 
    counter : number ; 
    socket : Socket ; 
    room : string | undefined  ; 


    constructor(room?:string|undefined) {
        super();
        this.room = room ; 
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.perspectiveCamera;
        this.timeStep = 1 / 30;

        this.initWorld();
        this.initCannonDebg();
        this.createcannonBody();
        this.socket = this.experience.socket ; 
        this.listenToSocket() ; 
        this.diceState = true ; 
        this.counter = 0 ; 
    }

    initWorld() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0),
            allowSleep: true,
        })
    }

    initCannonDebg() {
        this.CDebg = CannonDebugger(this.scene, this.world, {
            color: 0x0000ff,
            scale: 1,
        })
    }

    createcannonBody() {
        this.diceBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
            position: new CANNON.Vec3(0, 0, 0),
            mass: 0.002,
        })
        this.groundBody = new CANNON.Body({
            shape: new CANNON.Plane(),
            mass: 0,
            position: new CANNON.Vec3(0, 0, 0)

        })

        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

        this.addCannonBody();
    }

    addCannonBody() {
        this.world.addBody(this.diceBody);
        this.world.addBody(this.groundBody);
    }

    diceCalc() {
        return new Promise<number>((resolve)=>{
            if (this.diceBody.material) {
                this.diceBody.material.friction = 0;
            }
    
            this.diceBody.allowSleep = true;
    
            const func = (e: any) => {
                const euler = new CANNON.Vec3();
                e.target.quaternion.toEuler(euler);
    
                const eps = .1;
                let isZero = (angle: any) => Math.abs(angle) < eps;
                let isHalfPi = (angle: any) => Math.abs(angle - .5 * Math.PI) < eps;
                let isMinusHalfPi = (angle: any) => Math.abs(.5 * Math.PI + angle) < eps;
                let isPiOrMinusPi = (angle: any) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);
    
                if (isZero(euler.z)) {
                    if (isZero(euler.x)) {
                        // this.emit("DR" , 1);
                        this.diceBody.position.set(0, 0, 0);
                        this.diceState = true ; 
                        resolve(1);
                        return;
                    } else if (isHalfPi(euler.x)) {
                        // this.emit("DR" , 4);
                        this.diceBody.position.set(0, 0, 0);
                        this.diceState = true ; 
                        resolve(4);
                        return;
                    } else if (isMinusHalfPi(euler.x)) {
                        // this.emit("DR" , 3);
                        this.diceBody.position.set(0, 0, 0);
                        this.diceState = true ; 
                        resolve(3);
                        return;
                    } else if (isPiOrMinusPi(euler.x)) {
                        // this.emit("DR" , 6);
                        this.diceBody.position.set(0, 0, 0);
                        this.diceState = true ; 
                        resolve(6);
                        return;
                    } else {
                        // landed on edge => wait to fall on side and fire the event again
                        this.diceBody.allowSleep = true;
                    }
                } else if (isHalfPi(euler.z)) {
                    // this.emit("DR" , 2);
                    this.diceBody.position.set(0, 0, 0);
                    this.diceState = true ; 
                    resolve(2);
                    return;
                } else if (isMinusHalfPi(euler.z)) {
                    // this.emit("DR" , 5);
                    this.diceBody.position.set(0, 0, 0);
                    this.diceState = true ; 
                    resolve(5);
                    return;
                } else {
                    // landed on edge => wait to fall on side and fire the event again
                    this.diceBody.allowSleep = true;
                }
                return;
            }
            this.diceBody.addEventListener('sleep', func);
        })
    }

    applyRandomness = () => {
        this.diceBody.applyImpulse(new CANNON.Vec3(0, 0 + Math.random() * 0.03, 0));
        this.diceBody.applyImpulse(new CANNON.Vec3(0 + Math.random() * 0.02, 0, 0 + Math.random() * 0.01));
        this.diceBody.applyImpulse(new CANNON.Vec3(0 + Math.random() * 0.02, 0, 0 + Math.random() * 0.02));
        this.diceBody.applyTorque(new CANNON.Vec3(0, 0.2, 0));
    }

    throwDice() {
        this.diceState = false ; 
        this.diceCalc();
        this.applyRandomness();
    }

    listenToSocket(){
        this.socket.on('dice_update' , (data)=>{
            this.diceBody.position.copy(data.position) ; 
            this.diceBody.quaternion.copy(data.quaternion) ; 
        })
    }

    update() {
        if (this.world) {
            this.world.step(this.timeStep);
        }
        if (this.CDebg) {
            this.CDebg.update();
        }
        if(!this.diceState){
            // console.log(this.counter)
            if( this.counter === 5 ){
                const data:diceDataType = { room : this.room ,  position : this.diceBody.position , quaternion : this.diceBody.quaternion} ;
                this.socket.emit('dice_data' , data ) ; 
                this.counter = 0 ;
            }
            this.counter ++ ; 
        }
    }
}

export default Cannones; 