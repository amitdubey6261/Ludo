interface stepType{
    x:number , 
    y: number , 
}

class IdentifyPath {
    pathArray:stepType[] ; 

    findPath(steps:number , i:number , j:number ) {
        console.log(steps , i , j );
        const board =
            [
                [9, 9, 9, 9, 9, 9, 0, 0, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 3, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [0, 2, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 0],
                [0, 5, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 5, 5, 0],
                [0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 4, 0],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 1, 5, 0, 9, 9, 9, 9, 9, 9],
                [9, 9, 9, 9, 9, 9, 0, 0, 0, 9, 9, 9, 9, 9, 9],
            ]


        const checkOverFlow = (i: number, j: number): boolean => {
            if (i < 0 || i > 14) return true;
            if (j < 0 || j > 14) return true;
            return false;
        }


        const traverse = (step: number, i: number, j: number) => {
            if (checkOverFlow(i, j) || board[i][j] == 9 || board[i][j] == 5 || board[i][j] == 6) {
                return;
            }
            if (step == 0) {
                return;
            }

            console.log('rasta :', i, j);
            this.pathArray.push({x : i , y : j});

            if (i == 6) {
                traverse(step - 1, i, j + 1);
                if (checkOverFlow(i, j + 1) ? false : board[i][j + 1] == 6) {
                    traverse(step - 1, i - 1, j + 1);
                }
            }
            if (i == 8) {
                traverse(step - 1, i, j - 1);
                if (checkOverFlow(i, j - 1) ? false : board[i][j - 1] == 6) {
                    console.log('andatr')
                    traverse(step - 1, i + 1, j - 1);
                }
            }
            if (j == 6) {
                traverse(step - 1, i - 1, j);
                if (checkOverFlow(i - 1, j) ? false : board[i - 1][j] == 6) {
                    traverse(step - 1, i - 1, j - 1);
                }
            }
            if (j == 8) {
                traverse(step - 1, i + 1, j);
                if (checkOverFlow(i + 1, j) ? false : board[i + 1][j] == 6) {
                    traverse(step - 1, i + 1, j + 1);
                }
            }
            if (i == 0) {
                traverse(step - 1, i, j + 1);
            }
            if (i == 14) {
                traverse(step - 1, i, j - 1);
            }
            if (j == 0) {
                traverse(step - 1, i - 1, j);
            }
            if (j == 14) {
                traverse(step - 1, i + 1, j);
            }
        }


        const findPath = (step : number, i: number, j: number): number[] => {
            const pathIdxs = [1];
            traverse(step,  i ,  j);
            return pathIdxs;
        }

        findPath( steps , i , j );

    }

    getPath(steps:number , i:number , j:number):stepType[]{
        if( i == 3 && j == 3 ){
            // console.log( i , j  ,"___" , 6 , 1 );
            return [{ x : 6 , y : 1 }] ; 
        }
        else if( i == 3 && j == 12 ){
            // console.log( i , j  ,"___" , 1 , 8 );
            return [{ x : 1 , y : 8 }] ;
        }
        else if( i == 11 && j == 3 ){
            // console.log( i , j  ,"___" , 13 , 6 );
            return [{ x : 13 , y : 6 }] ;
        }
        else if( i == 11 && j == 12 ){
            // console.log( i , j  ,"___" , 8 , 13 );
            return [{ x : 8 , y : 13 }] ;
        }
        else{
            // console.log('not default' , i  , j );
            // return [{ x : 6 , y : 1 }] ;
            this.pathArray = [] ; 
            this.findPath(steps , i ,  j );
            return this.pathArray ; 
        }
    }
}

export default IdentifyPath; 