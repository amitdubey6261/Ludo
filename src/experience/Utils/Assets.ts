export interface AssetT{
    name : string ; 
    type : string ; 
    path : string ; 
}

const AssetsArray : AssetT[] = [
    {
        name : "model", 
        type : "glbmodel", 
        path : "/models/kira.glb", 
    }
]

export default AssetsArray ; 