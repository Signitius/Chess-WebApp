



var gameOccurying=true;

const pieceTypes={
    //change to reflect pieceTypes to aid checkOccupant()
    white:["pawn","knight","rook","bishop","queen","king"],
    black:["pawn","knight","rook","bishop","queen","king"]
}

export const gameState={

    sideToPlay:"white",

    whiteKingHasMoved:false,
    whiteKingRookHasMoved:false,
    whiteQueenRookHasMoved:false,


    blackKingHasMoved:false,
    blackKingRookHasMoved:false,
    blackQueenRookHasMoved:false,
        
    
    _50MoveRuleCount:0,
        
        
    repeatablePastpositions:[],//each is a json string of its corresponding currentPosition with sideToPlay concatenated


    _4thRankBlackPawnHistory:[],// to help with empassant
    _5thRankWhitePawnHistory:[],
        
    currentPosition:{
        //(8*8) square cordinates to simplify move calculation
        whitePawns:[[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
        blackPawns:[[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
        
        whiteBishops:[[2,0],[5,0]],
        blackBishops:[[2,7],[5,7]],

        whiteKnights:[[1,0],[6,0]],
        blackKnights:[[1,7],[6,7]],

        whiteRooks:[[0,0],[7,0]],
        blackRooks:[[0,7],[7,7]],

        whiteQueens:[[3,0]],
        blackQueens:[[3,7]],

        whiteKing:[[4,0]],
        blackKing:[[4,7]]
    }    
}
    
    


    
/*function playVsAi(){
    getPlayerMove();
    makeAiMove();
}
function playHumanChess(){
    getPlayerMove();
}*/
let pieceType;

export function collectLegalDestinations(square,currentPieceColor){
    if(gameState.sideToPlay==currentPieceColor){
        

        let castle=true;
        let movesToCheck=collectSemiLegalDestinations(square,castle,currentPieceColor);
        
        var verifiedMoves=[];
        for (let move of movesToCheck){
            if (avoidsCheck(square,move,currentPieceColor)){
                verifiedMoves.push(move);
            }

        }
        console.log(verifiedMoves);
        return verifiedMoves;
    }
    else{
        return null;
    }
    
}
function collectSemiLegalAttackDestinations(square,currentPieceColor){
    let castle=false;
    let semiLegalDest=collectSemiLegalDestinations(square,castle,currentPieceColor);
    
    return semiLegalDest;
}
function collectSemiLegalDestinations(square,castle,currentPieceColor){
    let destinationsArray=[];
   
    for (let array of Object.values(gameState.currentPosition)){
        for (let code of array){
            if (code[0]==square[0] && code[1]== square[1]){
                pieceType=getkey(gameState.currentPosition,array);
                break;
            }
        }
        
    }
    
    
    

    switch (pieceType){

        case "whitePawns":
            destinationsArray=destinationsArray.concat(whitePawnMove(square,currentPieceColor));
            break;

        case "blackPawns":
            destinationsArray=destinationsArray.concat(blackPawnMove(square,currentPieceColor));
            break;

        case "whiteBishops"||"blackBishops":
            destinationsArray=destinationsArray.concat(bishopMove(square,currentPieceColor));
            break;

        case "whiteknights"||"blackKnights":
            destinationsArray=destinationsArray.concat(knightmove(square,currentPieceColor));
            break;

        case "whiteRooks"||"blackRooks":
            destinationsArray=destinationsArray.concat(rookMove(square,currentPieceColor));
            break;

        case "whiteQueens"||"blackQueens":
            destinationsArray=destinationsArray.concat(queenMove(square,currentPieceColor));
            break;

        case "whiteKing":
            destinationsArray=destinationsArray.concat(whiteKingMove(square,castle,currentPieceColor));
            break;

        case "blackKing":
            destinationsArray=destinationsArray.concat(blackKingMove(square,castle,currentPieceColor));
            break;

        
        //pawns separated due to foward only movements
        //kings separated to ease castling calculation

    }
    
        
    
    return destinationsArray;

}

function whitePawnMove(square,currentPieceColor){
    let moveArray=[];
    let oneStepAbove=[square[0],square[1]+1];
    let twoStepsAbove=[square[0],square[1]+2];

    let leftUpperCorner=[square[0]-1,[1]+1];
    let rightUpperCorner=[square[0]+1,[1]+1];
    let pieceTransfer;

 
    
    //2 squares up on first pawn move
    if(square[1]==1){
        
        if(checkOccupant(oneStepAbove,currentPieceColor)==0 && checkOccupant(twoStepsAbove,currentPieceColor)==0){
            pieceTransfer=["normal",twoStepsAbove];
            
            moveArray.push(pieceTransfer);
            
        }
    }
    //one square up on first pawnmove
    if(checkOccupant(oneStepAbove,currentPieceColor)==0){
        pieceTransfer=["normal",oneStepAbove];
        
        moveArray.push(pieceTransfer);
        
    }  
    

    //pawncapture logic
    let whitePawnDirections=['short-range',[-1,1],[1,1]];
    let captureArray=generalMove(square,whitePawnDirections,currentPieceColor);
    moveArray=moveArray.concat(captureArray);

    //empassant logic
    if(square[1]==3){
        let oneStepLeft=[square[0]-1,square[1]];
        let oneStepRight=[square[0]+1,square[1]];
        
        if(oneStepLeft in gameState._4thRankBlackPawnHistory===false && checkOccupant(oneStepLeft,currentPieceColor)==1){
            pieceTransfer=["empassant",leftUpperCorner]
            
            moveArray.push(pieceTransfer);
            
        }
        if(oneStepRight in gameState._5thRankWhitePawnHistory===false && checkOccupant(oneStepRight,currentPieceColor)==1){
            pieceTransfer=["empassant",rightUpperCorner]
            
            moveArray.push(pieceTransfer);
            
        }
    }


    //promotion logic

    if(square[1]==6 && checkOccupant(oneStepAbove,currentPieceColor)==0){
        pieceTransfer=["promotion",oneStepAbove];
        
        moveArray.push(pieceTransfer);
        
    }
    return moveArray;

}
function blackPawnMove(square,currentPieceColor){
    
        let moveArray=[];
        let oneStepAbove=[square[0],square[1]-1];
        let twoStepsAbove=[square[0],square[1]-2];
    
        let leftUpperCorner=[square[0]-1,[1]-1];
        let rightUpperCorner=[square[0]+1,[1]-1];
        let pieceTransfer;
    
     
        
        //2 squares up on first pawn move
        if(square[1]==6){
            
            if(checkOccupant(oneStepAbove,currentPieceColor)==0 && checkOccupant(twoStepsAbove,currentPieceColor)==0){
                pieceTransfer=["normal",twoStepsAbove];
                
                moveArray.push(pieceTransfer);
                
            }
        }
        //one square up on first pawnmove
        if(checkOccupant(oneStepAbove,currentPieceColor)==0){
            pieceTransfer=["normal",oneStepAbove];
            
            moveArray.push(pieceTransfer);
            
        }  
        
    
        //pawncapture logic
        let blackPawnDirections=['short-range',[-1,-1],[1,-1]];
        let captureArray=generalMove(square,blackPawnDirections,currentPieceColor);
        moveArray=moveArray.concat(captureArray);
    
        //empassant logic
        if(square[1]==4){
            let oneStepLeft=[square[0]-1,square[1]];
            let oneStepRight=[square[0]+1,square[1]];
            
            if(oneStepLeft in gameState._5thRankWhitePawnHistory===false && checkOccupant(oneStepLeft,currentPieceColor)==1){
                pieceTransfer=["empassant",leftUpperCorner]
                
                moveArray.push(pieceTransfer);
                
            }
            if(oneStepRight in gameState._5thRankWhitePawnHistory===false && checkOccupant(oneStepRight,currentPieceColor)==1){
                pieceTransfer=["empassant",rightUpperCorner]
                
                moveArray.push(pieceTransfer);
                
            }
        }
    
    
        //promotion logic
    
        if(square[1]==1){
            if(checkOccupant(oneStepAbove,currentPieceColor)==0){
                pieceTransfer=["promotion",oneStepAbove];
                moveArray.push(pieceTransfer);
            }
            if (checkOccupant(leftUpperCorner,currentPieceColor)==1){
                pieceTransfer=["promotional capture",leftUpperCorner];
                moveArray.push(pieceTransfer);
            }
            if (checkOccupant(rightUpperCorner,currentPieceColor)==1){
                pieceTransfer=["promotional capture",rightUpperCorner];
                moveArray.push(pieceTransfer);
            }
            
        }
        
        return moveArray;
    
    
}

function bishopMove(square,currentPieceColor){
    let bishopDirections=["long-range",[-1,1],[1,1],[1,-1],[-1,-1]];
    return generalMove(square,bishopDirections,currentPieceColor);
}
function knightmove(square,currentPieceColor){
    let knightDirections=["short-range",[-2,1],[-2,-1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]];
    return generalMove(square,knightDirections,currentPieceColor);
}
function rookMove(square,currentPieceColor){
    let rookDirections=["long-range",[0,1],[-1,0],[1,0],[0,-1]];
    return generalMove(square,rookDirections,currentPieceColor);
}
function queenMove(square,currentPieceColor){
    let queenDirections=["long-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]];
    return generalMove(square,queenDirections,currentPieceColor);
}
function kingMove(square,currentPieceColor){
    console.log(currentPieceColor);
    let kingDirections=["short-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]];
    return generalMove(square,kingDirections,currentPieceColor);
}
    
function blackKingMove(square,castle,currentPieceColor){
    let kingMoveList=kingMove(square,currentPieceColor);
    if (castle==true){
        if (!(gameState.blackKingRookHasMoved||gameState.blackKingHasMoved)){
            let fSquare=[square[0]+1,square[1]];
            let gSquare=[square[0]+2,square[1]];
            if(!(isAttacked(square,currentPieceColor)) && checkOccupant(fSquare,currentPieceColor)==0 && !(isAttacked(fSquare,currentPieceColor)) && checkOccupant(gSquare,currentPieceColor)==0 && !isAttacked(gSquare,currentPieceColor)){
                let pieceTransfer=['blackcastling-kingside',gSquare];
                
                kingMoveList.push(pieceTransfer);
                
                
            }
        }
        if (!(gameState.blackQueenRookHasMoved||gameState.blackKingHasMoved)){
            let dSquare=[square[0]-1,square[1]];
            let cSquare=[square[0]-2,square[1]];
            let  bSquare=[square[0]-3,square[1]];
            if(!(isAttacked(square,currentPieceColor)) && checkOccupant(dSquare,currentPieceColor)==0 && !(isAttacked(dSquare,currentPieceColor)) && checkOccupant(cSquare,currentPieceColor)==0 && !isAttacked(cSquare,currentPieceColor) && checkOccupant(bSquare,currentPieceColor)==0){
                let pieceTransfer=['blackcastling-Queenside',cSquare];
                
                kingMoveList.push(pieceTransfer);
                
            }
        }
        
    }
    return kingMoveList;
    
}
function whiteKingMove(square,castle,currentPieceColor){
    let kingMoveList=kingMove(square);
    if (castle==true){
        if (!(gameState.whiteKingRookHasMoved||gameState.whiteKingHasMoved)){
            let fSquare=[square[0]+1,square[1]];
            let gSquare=[square[0]+2,square[1]];
            if(!(isAttacked(square,currentPieceColor)) && checkOccupant(fSquare,currentPieceColor)==0 && !(isAttacked(fSquare,currentPieceColor)) && checkOccupant(gSquare,currentPieceColor)==0 && !isAttacked(gSquare,currentPieceColor)){
                let pieceTransfer=['whitecastling-kingside',gSquare];
                
                kingMoveList.push(pieceTransfer);
                
                
            }
        }
        if (!(gameState.whiteQueenRookHasMoved||gameState.whiteKingHasMoved)){
            let dSquare=[square[0]-1,square[1]];
            let cSquare=[square[0]-2,square[1]];
            let  bSquare=[square[0]-3,square[1]];
            if(!(isAttacked(square,currentPieceColor)) && checkOccupant(dSquare,currentPieceColor)==0 && !(isAttacked(dSquare,currentPieceColor)) && checkOccupant(cSquare,currentPieceColor)==0 && !isAttacked(cSquare,currentPieceColor) && checkOccupant(bSquare,currentPieceColor)==0){
                let pieceTransfer=['whitecastling-Queenside',cSquare];
                
                kingMoveList.push(pieceTransfer);
                
            }
        }
    }
    
    return kingMoveList;
}
    
function attacks(square,directionsArray,position=gameState.currentPosition){
    let piece;
    for (let array of Object.values(position)){
        for (let code of array){
            if (code[0]==square[0] && code[1]== square[1]){

                piece=getkey(position,array);
                
                
                break;
            }
        }
        
    }
    switch(piece){
        
    }

    let attackedSquares=[]
    
    for(let direction of directionsArray){
        var newLocation=[square[0]+direction[0],square[1]+direction[1]];
        while (newLocation[0]>-1 && newLocation[0]<8 && newLocation[1]>-1 && newLocation[1]<8){
    
            attackedSquares.push(newLocation);

            if (directionsArray[0]=="short-range")break;

            let occupied=false;
            for (let array of Object.values(position)){
                for (let code of array){
                    if (code[0]==newLocation[0] && code[1]== newLocation[1]){
                        occupied=true;
                        break;
                    }
                }
                    
            }
            if (occupied==true){
                break;
            }
            
            newLocation=[square[0]+direction[0],square[1]+direction[1]];
        }
        
    }
    
    return attackedSquares;


}
function generalMove(square,directionsArray,currentPieceColor){
    let pieceTransfer=[];
    let movesArray=[];
    let attacked=attacks(square);
    for(let box of attacked){
        
        let status=checkOccupant(box,currentPieceColor);
        switch(status){
            case 0:
                pieceTransfer=["normal",box];
                movesArray.push(pieceTransfer);
                break;
            case 1:
                pieceTransfer=["capture",box];
                movesArray.push(pieceTransfer);
                break;
            case 2:
                break;
        }
    }
    return movesArray;
}

function checkOccupant(square,currentPieceColor){
    let type;
    let color;
    let value=0;
    for (let array of Object.values(gameState.currentPosition)){
        for (let code of array){
            if (code[0]==square[0] && code[1]== square[1]){
                type=getkey(gameState.currentPosition,array);
                color=(type.includes('white'))? 'white':'black';
                value=(color=currentPieceColor)? 2:1;
                break;
            }
        }
        
    }
    
    return value;


}
let copyPosition;
function avoidsCheck(square,move,currentPieceColor){
    copyPosition=JSON.parse(JSON.stringify(gameState.currentPosition));
    makeMove(square,move,copyPosition,currentPieceColor);
    return !(isCheck(copyPosition,currentPieceColor)); 

  

}
function isAttacked(square,position=gameState.currentPosition,currentPieceColor){
    let transfers=[];
    
    for (let array of Object.values(position)){
        if(!(getkey(position,array).includes(currentPieceColor))){
            for (let otherSquare of array){
                transfers=transfers.concat(attacks(otherSquare,position));
            }
        }
    }
    let squareAttacked=false;
    for(let transfer of transfers){

        if (transfer[1]==square) {
            squareAttacked=true;
            break;
        }

    }
    return squareAttacked;

    
}
function isCheck(position,currentPieceColor){
    let kingPosition;
    for(let property in position){
        if (property.includes(currentPieceColor)&& property.includes("King")){
            kingPosition=position[property][0];
            break;
        }
    }
    return isAttacked(kingPosition,position,currentPieceColor);


    
}




function checkStatus(){}
function makeAiMove(
    //choose random piece
    //make random move
){}
const boardMapping={
    a1:[0,0],b1:[1,0],c1:[2,0],d1:[3,0],e1:[4,0],f1:[5,0],g1:[6,0],h1:[7,0],
    a2:[0,1],b2:[1,1],c2:[2,1],d2:[3,1],e2:[4,1],f2:[5,1],g2:[6,1],h2:[7,1],
    a3:[0,2],b3:[1,2],c3:[2,2],d3:[3,2],e3:[4,2],f3:[5,2],g3:[6,2],h3:[7,2],
    a4:[0,3],b4:[1,3],c4:[2,3],d4:[3,3],e4:[4,3],f4:[5,3],g4:[6,3],h4:[7,3],
    a5:[0,4],b5:[1,4],c5:[2,4],d5:[3,4],e5:[4,4],f5:[5,4],g5:[6,4],h5:[7,4],
    a6:[0,5],b6:[1,5],c6:[2,5],d6:[3,5],e6:[4,5],f6:[5,5],g6:[6,5],h6:[7,5],
    a7:[0,6],b7:[1,6],c7:[2,6],d7:[3,6],e7:[4,6],f7:[5,6],g7:[6,6],h7:[7,6],
    a8:[0,7],b8:[1,7],c8:[2,7],d8:[3,7],e8:[4,7],f8:[5,7],g8:[6,7],h8:[7,7]
}
function codesToAddress(codes){
    return getkey(boardMapping,codes);
}
export function addressToCodes(address){
    
    return boardMapping[address];  
}



export function makeMove(origin,typeAndDestination,position,currentPieceColor){
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
            promotion(origin,typeAndDestination[1],position,currentPieceColor);
            break;
            
        case 'promotional capture': 
            promotionalCapture(origin,typeAndDestination[1],position);
            break;
    }
    
    gameState.sideToPlay=(gameState.sideToPlay=="black")? "white":"black";
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
function promotion(origin,move,position,currentPieceColor){
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



export function getkey(object,value){
    
    for (let key in object){
        
        if (object[key]== value){
            
            return key;
        }
        
    }
    
}
