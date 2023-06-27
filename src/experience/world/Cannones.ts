import * as CANNON from 'cannon-es' ; 
import Experience from '../Experience';
import CannonDebugger from 'cannon-es-debugger';

class Cannones {
    experience : Experience ; 
    scene : THREE.Scene ; 
    camera : THREE.PerspectiveCamera ;
    world : CANNON.World ; 
    CDebg : any ; 
    timeStep : number ;
    diceBody : CANNON.Body ;
    groundBody : CANNON.Body ; 


    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ; 
        this.camera = this.experience.camera.perspectiveCamera ; 
        this.timeStep = 1/30 ; 

        this.initWorld() ; 
        this.initCannonDebg() ;
        this.createcannonBody();
        this.diceCalc() ; 
    }

    initWorld(){
        this.world = new CANNON.World({
            gravity : new CANNON.Vec3( 0 , -9.82 , 0 ) , 
            allowSleep : true ,  
        })
    }

    initCannonDebg(){
        this.CDebg = CannonDebugger( this.scene , this.world , {
            color : 0x0000ff , 
            scale : 1 , 
        })
    }

    createcannonBody(){
        this.diceBody = new CANNON.Body({
            shape : new CANNON.Box(new CANNON.Vec3( 1 , 1 , 1 )) , 
            position : new CANNON.Vec3( -50 , 0 , -50 ) , 
            mass : 0.001 ,  
        })
        this.groundBody = new CANNON.Body({
            shape : new CANNON.Plane() , 
            mass : 0 , 
            position : new CANNON.Vec3( 0 , 0 , 0 )

        })

        this.groundBody.quaternion.setFromEuler( -Math.PI/2 , 0 , 0 );

        this.addCannonBody() ; 
    }

    addCannonBody(){
        this.world.addBody( this.diceBody );
        this.world.addBody( this.groundBody);
    }

    diceCalc(){
        if( this.diceBody.material ){
            this.diceBody.material.friction = 0 ; 
        }

        this.diceBody.allowSleep = true ;
        this.diceBody.addEventListener('sleep' , (e : any)=>{
            const euler = new CANNON.Vec3() ; 
            e.target.quaternion.toEuler(euler) ; 

            const eps = .1;
            let isZero = (angle:any) => Math.abs(angle) < eps;
            let isHalfPi = (angle:any) => Math.abs(angle - .5 * Math.PI) < eps;
            let isMinusHalfPi = (angle:any) => Math.abs(.5 * Math.PI + angle) < eps;
            let isPiOrMinusPi = (angle:any) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);

            if (isZero(euler.z)) {
                if (isZero(euler.x)) {
                    showRollResults(1);
                } else if (isHalfPi(euler.x)) {
                    showRollResults(4);
                } else if (isMinusHalfPi(euler.x)) {
                    showRollResults(3);
                } else if (isPiOrMinusPi(euler.x)) {
                    showRollResults(6);
                } else {
                    // landed on edge => wait to fall on side and fire the event again
                    this.diceBody.allowSleep = true;
                }
            } else if (isHalfPi(euler.z)) {
                showRollResults(2);
            } else if (isMinusHalfPi(euler.z)) {
                showRollResults(5);
            } else {
                // landed on edge => wait to fall on side and fire the event again
                this.diceBody.allowSleep = true;
            }

            function showRollResults(x:number){
                console.log(x) ;
            }
        })

        const applyRandomness = () =>{
            this.diceBody.applyImpulse( new CANNON.Vec3( 0 , 0+Math.random()*0.03 , 0 ));
            this.diceBody.applyImpulse( new CANNON.Vec3(  0+Math.random()*0.02 , 0 , 0+Math.random()*0.01 ));
            this.diceBody.applyImpulse( new CANNON.Vec3( 0+Math.random()*0.02, 0 , 0+Math.random()*0.02 ));
            this.diceBody.applyTorque( new CANNON.Vec3( 0 , 0.2 , 0 ));
        }


        window.addEventListener('click' , ()=>{
            applyRandomness(); 
            this.diceBody.position.set( -50 , 0 , -50) ; 
        })
    }
    
    update(){
        if( this.world ){
            this.world.step( this.timeStep );
        }
        if( this.CDebg ){
            this.CDebg.update() ; 
        }
    }
}

export default Cannones ; 