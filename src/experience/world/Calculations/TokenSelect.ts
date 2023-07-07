import * as THREE from 'three';
import Experience from "../../Experience";
import { EventEmitter } from 'events';

class TokenSelect extends EventEmitter {
    experience: Experience;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    grp: THREE.Group;
    pointer: THREE.Vector2;
    raycaster: THREE.Raycaster;
    selectedObject: any;

    constructor(tokens: THREE.Mesh[]) {
        super();
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.perspectiveCamera;
        this.grp = new THREE.Group();
        this.pointer = new THREE.Vector2;
        this.selectedObject = null;

        tokens.forEach((mesh) => {
            this.grp.add(mesh);
        })

        this.initRaycast();
    }

    selectToken() {
        return new Promise<THREE.Mesh>((resolve, reject) => {
            if (this.selectedObject) {
                resolve(this.selectedObject);
            }
            else {
                reject('not selcted any');
            }
        })
    }

    async getToken(open: boolean) {
        return new Promise<THREE.Mesh>((resolve , reject)=>{

            const defaultTokenPosition = [[3, 3], [3, 12], [11, 3], [11, 12]];

            const tokenAccordingToname = (token: any): boolean => {
                // if (token.name.charAt(0) != `${this.userTurn}`) {
                if (token.name.charAt(0) != `${0}`) {
                    return false;
                }
                return true;
            }
    
            const selectInsideOpenCase = (token: any, open: boolean): boolean => {
                if (!open) {
                    // if (token.position.x == defaultTokenPosition[this.userTurn][0] && token.position.z == defaultTokenPosition[this.userTurn][1]) {
                    if (token.position.x == defaultTokenPosition[0][0] && token.position.z == defaultTokenPosition[0][1]) {
                        return false;
                    }
                }
                return true;
            }
    
            const validateToken = (token: any, open: boolean): boolean => {
    
                if (!tokenAccordingToname(token)) {
                    alert('selected wrong token slect your token ');
                    return false;
                }
    
                if (!selectInsideOpenCase(token, open)) {
                    alert('you can select this token when you have 6');
                    return false;
                }
    
                return true;
            }
    
            const sToken = () => {
                return new Promise((resolve) => {
                    window.removeEventListener('click', func);
                    const token = this.selectToken();
                    resolve(token);
                })
            }
    
            const func = async () => {
                try {
                    const token = await sToken();
                    if (validateToken(token, open)) {
                        resolve(token as THREE.Mesh ) ; 
                    }
                    else {
                        alert('invalid token try again');
                        reject();
                    }
                }
                catch (e) {
                    alert(e + "try again");
                    reject();
                }
            };
    
            window.addEventListener('click', func);
        })
    }


    initRaycast() {

        this.scene.add(this.grp)

        console.log(this.grp)

        document.addEventListener('pointermove', (event: any) => {
            if (this.selectedObject) {

                this.selectedObject.material.color = new THREE.Color(0xaa00000);
                this.selectedObject.scale.set(1, 1, 1);
                this.selectedObject = null;

            }
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster = new THREE.Raycaster();
            this.raycaster.setFromCamera(this.pointer, this.camera);
            let ins = this.raycaster.intersectObject(this.grp, true);
            if (ins.length > 0) {
                const res = ins.filter(function (res) {
                    return res && res.object;

                })[0];

                if (res && res.object) {

                    this.selectedObject = res.object;
                    this.selectedObject.material.color = new THREE.Color(0xffffff);
                    this.selectedObject.scale.set(1.2, 1.2, 1.2);

                }
            }
        });

    }
}

export default TokenSelect; 