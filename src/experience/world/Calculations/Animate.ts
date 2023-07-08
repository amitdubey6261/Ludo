import * as THREE from 'three';
import gsap from "gsap";

import Experience from "../../Experience";
import { defaultPosition, safePositions } from '../../Static';

interface stepType{
    x : number ; 
    y : number ; 
    z : number ; 
}

export default class Animate{
    experience : Experience ; 
    scene : THREE.Scene ; 
    ate : boolean ; 
    safeTokenPostions : number[][] ; 
    defaultTokenPostions : number[][] ; 
    
    constructor(){
        this.experience = new Experience() ; 
        this.scene = this.experience.scene ; 
        this.ate = false ; 
        this.safeTokenPostions = safePositions() ; 
        this.defaultTokenPostions = defaultPosition() ; 
    }

    animateTokenAndCheckAte(token : THREE.Mesh , coordinates:stepType[]):Promise<boolean>{
        return new Promise((resolve , reject)=>{
            const coords = [...coordinates] ; 

            const checkTokenPositionIsSafePosition = (): boolean => {
                return this.safeTokenPostions.some((elem) => {
                  return elem[0] === token.position.x && elem[1] === token.position.z;
                });
              };

            const checkAte = ():boolean =>{
                //check all token position other than active token 
                //skip the checks for safe positions
                //if active token and other token position gets same return true and sanp the catured to home 
                if( !checkTokenPositionIsSafePosition() ){
                    for(let i = 0 ; i<4  ; i++ ){
                        if( i != Number(token.name.charAt(0)) ){
                            for(let j = 0 ; j<4 ; j++ ){
                                const otherToken:THREE.Mesh = this.scene.getObjectByName(`${i}${j}`) as THREE.Mesh ;
                                console.log('check : ' , otherToken.position , token.position ); 
                                if( otherToken.position.x == token.position.x && otherToken.position.z == token.position.z ){
                                    snapToHome(otherToken);
                                    return true ; 
                                }
                            }
                        }
                    }
                }
                return false ; 
            }

            const animate = () =>{
                if( coords.length > 0 ){
                    const position:stepType|undefined = coords.shift() ; 
                    if(position != undefined ){
                        gsap.to(token.position , {
                            duration : 0.5 , 
                            x : position.x , 
                            y : position.y , 
                            z : position.z , 
                            onComplete : animate 
                        });
                    }
                }
                else{
                    if(checkAte()){
                        resolve(true) ; 
                    }
                    else{
                        reject(false) ; 
                    }
                }
            }

            const snapToHome = (token:THREE.Mesh) =>{
                alert('kaat liya yar ');
                const homeIdx = Number(token.name.charAt(0)) ; 

                gsap.to(token.position , {
                    duration : 0.7 , 
                    x : this.defaultTokenPostions[homeIdx][0] , 
                    y : 0 , 
                    z : this.defaultTokenPostions[homeIdx][1] ,  
                })
            }
    
            animate() ; 
        })
    }

    update(){

    }
}