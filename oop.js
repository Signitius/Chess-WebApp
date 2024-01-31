
export function makeMove(origin,typeAndDestination,position){
    switch (typeAndDestination[0]){
            
        case 'empassant': 
            empassant(origin,typeAndDestination[1],position);
            break;
            
        case 'capture': 
            capture(origin,typeAndDestination[1],position);
            break;
            
        case'normal': 
            generalMover(origin,typeAndDestination[1],position);
            break;
            
        case 'whitecastling-Queenside': 
            whiteKingCastle(position);
            break;
            
        case'blackcastling-kingside': 
            whiteQueenCastle(position);
            break;
            
        case 'whitecastling-kingside': 
            blackKingCastle(position);
            break;
            
        case 'blackcastling-Queenside': 
            blackQueenCastle(position);
            break;
            
        case 'promotion': 
            promotion(origin,typeAndDestination[1],position);
            break;
            
        case 'promotional capture': 
            promotionalCapture(origin,typeAndDestination[1],position);
            break;
    }
    
    sideToPlay=(sideToPlay=="black")? "white":"black";
}
function generalMover(origin,move,position){
    for (let array of Object.values(position)){
        for (let code of array){
            if (code[0]==origin[0] && code[1]== origin[1]){
                array[array.indexOf(origin)]=move;
                break;
            }
        }
        
    }
    

}
function empassant(origin,move,position){
    generalMover(origin,move,position);
    let below=[move[0],move[1]-1];
    for (let array of Object.values(position)){
        for (let code of array){
            if (code[0]==below[0] && code[1]== below[1]){
                array.splice(array.indexOf(below),1);
                break;
            }
        }
        
    }
   
    

}
function capture(origin,move,position){
    for (let array of Object.values(position)){
        for (let code of array){
            if (code[0]==move[0] && code[1]== move[1]){
                array.splice(array.indexOf(move),1);
                break;
            }
        }
        
    }
    
    generalMover(origin,move,position);
}
function promotion(origin,move,position){
    for (let array of Object.values(position)){
        for (let code of array){
            if (code[0]==origin[0] && code[1]== origin[1]){
                array.splice(origin,1);
                break;
            }
        }
        
    }
    
    for(arrayProperty of Object.keys(position)){
        if (arrayProperty.includes('Queen') && arrayProperty.includes(currentPieceColor)){
            array["arrayProperty"].push(move);
            break;

        }
    }
    //auto queen promotion for now. must change it later
}
function promotionalCapture(move,position){
    for (let array of Object.values(position)){
        for (let code of array){
            if (code[0]==move[0] && code[1]== move[1]){
                array.splice(array.indexOf(move),1);
                break;
            }
        }
        
    }
    
    promotion(move);
}

function whiteKingCastle(position){
    let rookSwap=position.whiteRooks.indexOf([7,0])
    position.whiteRooks[rookSwap]=[5,0];
    position.whiteKing[0]=[6,0];
}
function whiteQueenCastle(position){
    let rookSwap=position.whiteRooks.indexOf([0,0])
    position.whiteRooks[rookSwap]=[3,0];
    position.whiteKing[0]=[2,0];
}
function blackKingCastle(position){
    let rookSwap=position.whiteRooks.indexOf([7,7])
    position.whiteRooks[rookSwap]=[5,7];
    position.whiteKing[0]=[6,7];
}
function blackQueenCastle(position){
    let rookSwap=position.whiteRooks.indexOf([0,7])
    position.whiteRooks[rookSwap]=[3,7];
    position.whiteKing[0]=[2,7];
}




