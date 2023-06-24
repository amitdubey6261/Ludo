import Experience from './experience/Experience';
import './style.css';

const canvas = document.querySelector('.experience-canvas') as HTMLCanvasElement ;

const experience = new Experience( canvas ) ; 

console.log( experience ); 