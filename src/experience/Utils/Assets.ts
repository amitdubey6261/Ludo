export interface AssetT{
    name : string ; 
    type : string ; 
    path : string ; 
}

const AssetsArray : AssetT[] = [
    {
        name : "kira", 
        type : "glbmodel", 
        path : "/models/kira.glb", 
    }
    ,
    {
        name : "michelle",  
        type : "glbmodel",
        path : "/models/Michelle.glb",

    }
    ,
    {
        name : "dice" , 
        type : "glbmodel", 
        path : "/models/dice.glb" , 
    }
    ,
    {
        name : "board" , 
        type : "glbmodel",
        path : "/models/newBoard.glb" , 
    }
    ,
    {
        name : "token",
        type : "glbmodel" ,
        path : "/models/token.glb" , 
    }
]

export default AssetsArray ; 