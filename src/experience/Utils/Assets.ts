export interface AssetT{
    name : string ; 
    type : string ; 
    path : string ; 
}

const AssetsArray : AssetT[] = [
    {
        name : "dice" , 
        type : "glbmodel", 
        path : "/models/dice.glb" , 
    }
    ,
    // {
    //     name : "board" , 
    //     type : "glbmodel",
    //     path : "/models/newBoard.glb" , 
    // }
    // ,
    {
        name : "token",
        type : "glbmodel" ,
        path : "/models/token.glb" , 
    }
    ,
    {
        name : "DICEB",
        type : "glbmodel" ,
        path : "/models/LudoBoard.glb" , 
    }
    ,
    {
        name : "imgTexture",
        type : 'texture',
        path : "/models/TILESU.jpg"
    }
]

export default AssetsArray ; 