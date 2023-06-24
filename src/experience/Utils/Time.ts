import {EventEmitter} from 'events' ; 

export default class Time extends EventEmitter{
    start : number ; 
    current : number ; 
    elapsed : number ; 
    delta : number ; 
    
    constructor(){
        super() ; 
        this.start = Date.now() ;
        this.current = this.start ; 
        this.elapsed = 0 ; 
        this.delta = 16 ; 
        
        this.update() ; 
    }

    update():void{
        const currentTime: number = Date.now();
        this.current = currentTime - this.current ; 
        this.current = currentTime ; 
        this.elapsed = this.current - this.start ; 

        this.emit('update');
        window.requestAnimationFrame(this.update.bind(this));
    }
}