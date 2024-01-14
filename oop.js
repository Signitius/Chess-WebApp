



var gameOccurying=true;

const pieceTypes={
    //change to reflect pieceTypes to aid checkOccupant()
    white:["pawn","knight","rook","bishop","queen","king"],
    black:["pawn","knight","rook","bishop","queen","king"]
}

const gameState={

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
    
    


    
function playVsAi(){
    getPlayerMove();
    makeAiMove();
}
function playHumanChess(){
    getPlayerMove();
}
let pieceType;

function collectLegalDestinations(square){
    let castle=true;
    let movesToCheck=collectSemiLegalDestinations(square,castle);
    let verifiedMoves;
    for (let move in movesToCheck){
        if (avoidsCheck(move)){
            verifiedMoves.push(move);
        }

    }
    return verifiedMoves;
}
function collectSemiLegalAttackDestinations(square){
    let castle=false;
    let semiLegalDest=collectSemiLegalDestinations(square,castle);
    
    return semiLegalDest;
}
function collectSemiLegalDestinations(square,castle){
    let destinationsArray=[];
   
    for (let array of gameState.currentPosition){
        if(square in array){
            pieceType=gameState.currentPosition.getkeys[array];
            break;
        }
    }
    
    

    switch (pieceType){

        case "whitePawns":
            destinationsArray=destinationsArray.concat(whitePawnMove(square));
            break;

        case "blackPawns":
            destinationsArray=destinationsArray.concat(blackPawnMove(square));
            break;

        case "whiteBishops"||"blackBishops":
            destinationsArray=destinationsArray.concat(bishopMove(square));
            break;

        case "whiteknights"||"blackKnights":
            destinationsArray=destinationsArray.concat(knightmove(square));
            break;

        case "whiteRooks"||"blackRooks":
            destinationsArray=destinationsArray.concat(rookMove(square));
            break;

        case "whiteQueens"||"blackQueens":
            destinationsArray=destinationsArray.concat(queenMove(square));
            break;

        case "whiteKing":
            destinationsArray=destinationsArray.concat(whiteKingMove(square,castle));
            break;

        case "blackKing":
            destinationsArray=destinationsArray.concat(blackKingMove(square,castle));
            break;

        
        //pawns separated due to foward only movements
        //kings separated to ease castling calculation

    }
    
        
    
    return destinationsArray;

}

function whitePawnMove(square){
    let moveArray=[];
    let oneStepAbove=[square[0],square[1]+1];
    let twoStepsAbove=[square[0],square[1]+2];

    let leftUpperCorner=[square[0]-1,[1]+1];
    let rightUpperCorner=[square[0]+1,[1]+1];
    let pieceTransfer;

 
    
    //2 squares up on first pawn move
    if(square[1]==1){
        
        if(checkOccupant(oneStepAbove)==0 && checkOccupant(twoStepsAbove)==0){
            pieceTransfer=["normal",twoStepsAbove];
            
            moveArray.push(pieceTransfer);
            
        }
    }
    //one square up on first pawnmove
    if(checkOccupant(oneStepAbove)==0){
        pieceTransfer=["normal",oneStepAbove];
        
        moveArray.push(pieceTransfer);
        
    }  
    

    //pawncapture logic
    if(checkOccupant(leftUpperCorner)==1){
        pieceTransfer=["capture",leftUpperCorner];
        
        moveArray.push(pieceTransfer);
        
    }

    if(checkOccupant(rightUpperCorner)==1){
        pieceTransfer=["capture",rightUpperCorner];
        
        moveArray.push(pieceTransfer);
        
    }

    //empassant logic
    if(square[1]==3){
        let oneStepLeft=[square[0]-1,square[1]];
        let oneStepRight=[square[0]+1,square[1]];
        
        if(oneStepLeft in gameState._4thRankBlackPawnHistory===false && checkOccupant(oneStepLeft)==1){
            pieceTransfer=["empassant",leftUpperCorner]
            
            moveArray.push(pieceTransfer);
            
        }
        if(oneStepRight in gameState._5thRankWhitePawnHistory===false && checkOccupant(oneStepRight)==1){
            pieceTransfer=["empassant",rightUpperCorner]
            
            moveArray.push(pieceTransfer);
            
        }
    }


    //promotion logic

    if(square[1]==6 && checkOccupant(oneStepAbove)==0){
        pieceTransfer=["promotion",oneStepAbove];
        
        moveArray.push(pieceTransfer);
        
    }
    return moveArray;

}
function blackPawnMove(square){
    function whitePawnMove(square){
        let moveArray=[];
        let oneStepAbove=[square[0],square[1]-1];
        let twoStepsAbove=[square[0],square[1]-2];
    
        let leftUpperCorner=[square[0]-1,[1]-1];
        let rightUpperCorner=[square[0]+1,[1]-1];
        let pieceTransfer;
    
     
        
        //2 squares up on first pawn move
        if(square[1]==6){
            
            if(checkOccupant(oneStepAbove)==0 && checkOccupant(twoStepsAbove)==0){
                pieceTransfer=["normal",twoStepsAbove];
                
                moveArray.push(pieceTransfer);
                
            }
        }
        //one square up on first pawnmove
        if(checkOccupant(oneStepAbove)==0){
            pieceTransfer=["normal",oneStepAbove];
            
            moveArray.push(pieceTransfer);
            
        }  
        
    
        //pawncapture logic
        if(checkOccupant(leftUpperCorner)==1){
            pieceTransfer=["capture",leftUpperCorner];
            
            moveArray.push(pieceTransfer);
            
        }
    
        if(checkOccupant(rightUpperCorner)==1){
            pieceTransfer=["capture",rightUpperCorner];
            
            moveArray.push(pieceTransfer);
            
        }
    
        //empassant logic
        if(square[1]==4){
            let oneStepLeft=[square[0]-1,square[1]];
            let oneStepRight=[square[0]+1,square[1]];
            
            if(oneStepLeft in gameState._5thRankWhitePawnHistory===false && checkOccupant(oneStepLeft)==1){
                pieceTransfer=["empassant",leftUpperCorner]
                
                moveArray.push(pieceTransfer);
                
            }
            if(oneStepRight in gameState._5thRankWhitePawnHistory===false && checkOccupant(oneStepRight)==1){
                pieceTransfer=["empassant",rightUpperCorner]
                
                moveArray.push(pieceTransfer);
                
            }
        }
    
    
        //promotion logic
    //promotional captures shall be checked at makeMove() time
        if(square[1]==1 && checkOccupant(oneStepAbove)==0){
            pieceTransfer=["promotion",oneStepAbove];
            if(avoidsCheck(pieceTransfer)){
                moveArray.push(pieceTransfer);
            }
        }
        return moveArray;
    
    }
}
function bishopMove(square){
    let bishopDirections=["long-range",[-1,1],[1,1],[1,-1],[-1,-1]];
    return generalMove(square,bishopDirections);
}
function knightmove(square){
    let knightDirections=["short-range",[-2,1],[-2,-1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]];
    return generalMove(square,knightDirections);
}
function rookMove(square){
    let rookDirections=["long-range",[0,1],[-1,0],[1,0],[0,-1]];
    return generalMove(square,rookDirections);
}
function queenMove(square){
    let queenDirections=["long-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]];
    return generalMove(square,queenDirections);
}
function kingMove(square){
    let kingDirections=["short-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]];
    return generalMove(square,kingDirections);
    
}
    
function blackKingMove(square,castle){
    let kingMoveList=kingMove(square);
    if (castle==true){
        if (!(gameState.blackKingRookHasMoved||gameState.blackKingHasMoved)){
            let fSquare=[square[0]+1,square[1]];
            let gSquare=[square[0]+2,square[1]];
            if(!(isAttacked(square)) && checkOccupant(fSquare)==0 && !(isAttacked(fSquare)) && checkOccupant(gSquare)==0 && !isAttacked(gSquare)){
                let pieceTransfer=['blackcastling-kingside',gSquare];
                
                kingMoveList.push(pieceTransfer);
                
                
            }
        }
        if (!(gameState.blackQueenRookHasMoved||gameState.blackKingHasMoved)){
            let dSquare=[square[0]-1,square[1]];
            let cSquare=[square[0]-2,square[1]];
            let  bSquare=[square[0]-3,square[1]];
            if(!(isAttacked(square)) && checkOccupant(dSquare)==0 && !(isAttacked(dSquare)) && checkOccupant(cSquare)==0 && !isAttacked(cSquare) && checkOccupant(bSquare)==0){
                let pieceTransfer=['blackcastling-Queenside',cSquare];
                
                kingMoveList.push(pieceTransfer);
                
            }
        }
        
    }
    return kingMoveList;
    
}
function whiteKingMove(square,castle){
    let kingMoveList=kingMove(square);
    if (castle=true){
        if (!(gameState.whiteKingRookHasMoved||gameState.whiteKingHasMoved)){
            let fSquare=[square[0]+1,square[1]];
            let gSquare=[square[0]+2,square[1]];
            if(!(isAttacked(square)) && checkOccupant(fSquare)==0 && !(isAttacked(fSquare)) && checkOccupant(gSquare)==0 && !isAttacked(gSquare)){
                let pieceTransfer=['whitecastling-kingside',gSquare];
                
                kingMoveList.push(pieceTransfer);
                
                
            }
        }
        if (!(gameState.whiteQueenRookHasMoved||gameState.whiteKingHasMoved)){
            let dSquare=[square[0]-1,square[1]];
            let cSquare=[square[0]-2,square[1]];
            let  bSquare=[square[0]-3,square[1]];
            if(!(isAttacked(square)) && checkOccupant(dSquare)==0 && !(isAttacked(dSquare)) && checkOccupant(cSquare)==0 && !isAttacked(cSquare) && checkOccupant(bSquare)==0){
                let pieceTransfer=['whitecastling-Queenside',cSquare];
                
                kingMoveList.push(pieceTransfer);
                
            }
        }
    }
    
    return kingMoveList;
}
    
function generalMove(square,directionsArray){
    let moveArray=[]
    for (let direction of directionsArray){
        if(direction=='short-range'|| direction=="long-range"){
            continue;
        }
        let newLocation=[square[0]+direction[0],square[1]+direction[1]];
        while (newLocation[0]>-1 && newLocation[0]<8 && newLocation[1]>-1 && newLocation[1]<8){
            
            if (checkOccupant(newLocation)==0){
                pieceTransfer=['normal',newLocation];
                
                moveArray.push(pieceTransfer);
                
                if (directionsArray[0]=="short-range"){
                    break;
                }
                continue;
            }
            if(checkOccupant(newLocation)==2){
                break;

            }
            if(checkOccupant(newLocation)==1) {
                pieceTransfer=['capture',newLocation];
                
                moveArray.push(pieceTransfer);
                
                break;
            }
            
            newLocation=[square[0]+direction[0],square[1]+direction[1]];
        }
        
    }
    return moveArray;

}
var currentPieceType;
var currentPieceColor=(()=>{
    return (currentPieceType.includes('white'))? 'white':"false"
})();
function checkOccupant(square){
    let type;
    let color;
    let value=0;
    for (let array of gameState.currentPosition){
        if(square in array){
            type=gameState.currentPosition.getkeys[array];
            color=type.includes('white')? 'white':'black';
            value=(color=currentPieceColor)? 2:1;
            break;
            
        }
    }
    return value;


}
function avoidsCheck(move){
    let copyPosition=gameState.currentPosition;
    makeTestMove(copyPosition,move);
    return !(isCheck(copyPosition)); 

  

}
function isAttacked(square){
    let transfers=[];
    
    for (let array of gameState.currentPosition){
        if(!(gameState.currentPosition.getkeys[array]).includes(currentPieceColor)){
            for (let otherSquare of array){
                transfers.push(collectSemiLegalAttackDestinations(otherSquare));
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
function isCheck(position){
    let kingPosition
    for(let property in position){
        if (property.includes(currentPieceColor)&& property.includes("King")){
            kingPosition=position[property][0];
            break;
        }
    }
    return isAttacked(kingPosition);

//generate isattackedmoved of opponents
//see if there
    
}
function makeMove(){}
function makeTestMove(){}
function updateState(){}
function checkState(){}
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
function codesToAddress(codes)
    return boardMapping.getkeys[codes];
{}
function addressToCodes(address){
    return boardMapping.address;  
}


