sideToPlay="white"
whiteKingHasMoved=false;
whiteKingRookHasMoved=false;
whiteQueenRookHasMoved=false;


blackKingHasMoved=false;
blackKingRookHasMoved=false;
blackQueenRookHasMoved=false;
        
    
_50MoveRuleCount=0;
        
        
repeatablePastpositions=[];//each is a json string of its corresponding currentPosition with sideToPlay concatenated


_4thRankBlackPawnHistory=[];// to help with empassant
_5thRankWhitePawnHistory=[];
        
currentPosition={
    //(8*8) square cordinates to simplify move calculation

    whitePawn:[[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    blackPawn:[[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
        
    whiteBishop:[[2,0],[5,0]],
    blackBishop:[[2,7],[5,7]],

    whiteKnight:[[1,0],[6,0]],
    blackKnight:[[1,7],[6,7]],

    whiteRook:[[0,0],[7,0]],
    blackRook:[[0,7],[7,7]],

    whiteQueen:[[3,0]],
    blackQueen:[[3,7]],

    whiteKing:[[4,0]],
    blackKing:[[4,7]]
}


export function moveAccept(){
    updateStatus();
    updateBoard();
    checkStatus();
}




function updateBoard(){
    let images=querySelectorAll("img");
    images.remove();
    for (let entry of Object.entries(currentPosition)){
        for (let location of entry[1]) newImage(location);
    }
}

function newImage(location){
    let imageSources=["wikipedia/blackRook.png","wikipedia/blackKnight.png","wikipedia/blackBishop.png",
    "wikipedia/blackQueen.png","wikipedia/blackKing.png","wikipedia/blackPawhiteKnight.png",
    "wikipedia/whitePawn.png","wikipedia/whiteRook.png","wikipedia/whiteKnight.png",
    "wikipedia/whiteBishop.png","wikipedia/whiteQueen.png","wikipedia/whiteKing.png"]

    
    let locationId=codesToId(location)
    let parentSquare=document.getElementById(locationId);
    for (let source in imageSources){
        if(source.contains(entry[0])===false) continue;
        let img=document.createElement("img");
        img.src=source;
        parentSquare.appendChild(img);      
    }
}
function updateStatus(){}
function checkStatus(){}


let futurePosition;

export function avoidsCheck(move){
    futurePosition=JSON.parse(JSON.stringify(currentPosition));
    makeMove(move,futurePosition);
    return !(isCheck(futurePosition));
}

function isCheck(position){
    let kingPosition=(sideToPlay==="white")? position["whiteKing"][0]:position["blackKing"][0];
    return isAttacked(kingPosition,position);      
}

export let opponentPossibleMoves=[];

function isAttacked(square,position,){
    /*Also generates the opponents general move list(moves that depend on attacking a square)
     for next turn*/
    opponentPossibleMoves=generalMoves(opponentColor,position);
    let squareAttacked=false;

    for(let move of opponentPossibleMoves){
        squareAttacked=(move[1][1]===square)? true:false;
        break;
    }
    return squareAttacked;   
}

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
function codesToId(codes){
    return getkey(boardMapping,codes);
}
export function idToCodes(address){
    return boardMapping[address];
}

function getkey(object,value){ 
    for (let key of Object.keys(object)){     
        if (object[key]=== value) return key;    
    }
    console.log('value does not exist');
    return null;
}


function generalMoves(opponentColor,position){
    let moveArray=[];
    let attacked=attackMoves(opponentColor,position);
    for(let moveCodes of attacked){
        if(checkOccupant(moveCodes[1])===1){
            moveArray.push(["capture",moveCodes[1]]);
            continue;
        }
        //eliminate pawn diagonal movement if not capture
        if (belongsTo(position,moveCodes[0])===whitePawn||belongsTo(position,moveCodes[0])===blackPawn) continue;
        if(checkOccupant(moveCodes[1])===0) moveArray.push(["normal",moveCodes[1]]);

    }
    return moveArray;
}
function nonAttackMoves(){}
function nonAttackPawnMoves(key){
    if(key==="whitePawn") return nonAttackWhitePawnMoves();
    else return nonAttackBlackPawnMoves();
}
function nonAttackWhitePawnMoves(){
    let moveArray=[];
    let pieceTransfer;

    let oneStepLeft=[square[0]-1,square[1]];
    let oneStepRight=[square[0]+1,square[1]];

    let oneStepAbove=[square[0],square[1]+1];
    let twoStepsAbove=[square[0],square[1]+2];  
    let leftUpperCorner=[square[0]-1,[1]+1];
    let rightUpperCorner=[square[0]+1,[1]+1]; 
    

    if(oneStepLeft[0]===-1) oneStepLeft=null;
    if(oneStepRight[0]===8)oneStepRight=null;
    // they also represent the case for left and right corners

    //two squares up on first move
    if(square[1]==1 && checkOccupant(oneStepAbove)==0 && checkOccupant(twoStepsAbove)==0){
        pieceTransfer=["normal",[square,twoStepsAbove]];
        moveArray.push(pieceTransfer);    
        
    }
    //one square up 
    if(checkOccupant(oneStepAbove)==0){
        pieceTransfer=["normal",[square,oneStepAbove]];
        moveArray.push(pieceTransfer); 
    }
    
    //empassant
    if(square[1]!=4)return moveArray;
    if(oneStepLeft && oneStepLeft in _4thRankBlackPawnHistory===false && checkOccupant(oneStepLeft)==1){
        pieceTransfer=["empassant",[square,leftUpperCorner]];
        moveArray.push(pieceTransfer);
    }
    if( oneStepRight && oneStepRight in _5thRankWhitePawnHistory===false && checkOccupant(oneStepRight)==1){
        pieceTransfer=["empassant",[square,rightUpperCorner]];
        moveArray.push(pieceTransfer);
    } 
        return moveArray; 
}

function nonAttackBlackPawnMoves(){
    let moveArray=[];
    let pieceTransfer;

    let oneStepLeft=[square[0]-1,square[1]];
    let oneStepRight=[square[0]+1,square[1]];

    let oneStepAbove=[square[0],square[1]-1];
    let twoStepsAbove=[square[0],square[1]-2];
    let leftUpperCorner=[square[0]-1,[1]-1];
    let rightUpperCorner=[square[0]+1,[1]-1];

    if(oneStepLeft[0]===-1) oneStepLeft=null;
    if(oneStepRight[0]===8)oneStepRight=null;
    // they also represent the case for left and right corners

    //two steps up on first move
    if(square[1]==6 && checkOccupant(oneStepAbove)==0 && checkOccupant(twoStepsAbove)==0){
        pieceTransfer=["normal",[square,twoStepsAbove]];    
        moveArray.push(pieceTransfer);    
    }
    //one step up
    if(checkOccupant(oneStepAbove)==0){
        pieceTransfer=["normal",[square,oneStepAbove]];     
        moveArray.push(pieceTransfer);     
    }  

    //empassant
    if(square[1]!=3)return moveArray;

    if(oneStepLeft && oneStepLeft in _5thRankWhitePawnHistory===false && checkOccupant(oneStepLeft)==1){
        pieceTransfer=["empassant",[square,leftUpperCorner]]
        moveArray.push(pieceTransfer);       
    }
    if(oneStepRight && oneStepRight in _5thRankWhitePawnHistory===false && checkOccupant(oneStepRight)==1){
        pieceTransfer=["empassant",[square,rightUpperCorner]]
        moveArray.push(pieceTransfer);     
    }
    return moveArray;
        //promotion logic will be handled separately from movelogic
}

function kingSideCastlingValid(kingSquare,kingMoved,rookMoved){
    let fSquare=[kingSquare[0]+1,kingSquare[1]];
    let gSquare=[kingSquare[0]+2,kingSquare[1]];
    
    if(isAttacked(kingSquare)) return false;
    if(kingMoved || rookMoved) return false;
    if(checkOccupant(fSquare)!=0 ||isAttacked(fSquare)) return false;
    if(checkOccupant(gSquare)!=0 ||isAttacked(gSquare)) return false;
    //checkOccupant() has 3 possible return values
    return true;      
    
}
function queenSideCastlingValid(kingSquare,kingMoved,rookMoved){
    let dSquare=[kingSquare[0]-1,kingSquare[1]];
    let cSquare=[kingSquare[0]-2,kingSquare[1]];
    let bSquare=[kingSquare[0]-3,kingSquare[1]]
    
    if(isAttacked(kingSquare)) return false;
    if(kingMoved || rookMoved) return false;
    if(checkOccupant(dSquare)!=0 ||isAttacked(dSquare)) return false;
    if(checkOccupant(cSquare)!=0 ||isAttacked(cSquare)) return false;
    if(checkOccupant(bSquare)!=0 ||isAttacked(bSquare)) return false;
    //checkOccupant() has 3 possible return values
    return true;      
    
}
function attackMoves(opponentColor,position){
    let moveCodes=[];
    let DirectionArrayHolder={
        //duplication endured to match properties (and property order) to those in currentPosition for faster association
        whitePawn:['short-range',[-1,1],[1,1]],
        blackPawn:['short-range',[-1,-1],[1,-1]],
        whiteBishop:["long-range",[-1,1],[1,1],[1,-1],[-1,-1]],
        blackBishop:["long-range",[-1,1],[1,1],[1,-1],[-1,-1]],
        whiteKnight:["short-range",[-2,1],[-2,-1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]],
        blackKnight:["short-range",[-2,1],[-2,-1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]],
        whiteRook:["long-range",[0,1],[-1,0],[1,0],[0,-1]],
        blackRook:["long-range",[0,1],[-1,0],[1,0],[0,-1]],
        blackQueen:["long-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
        whiteQueen:["long-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
        whiteKing:["short-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
        blackKing:["short-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
    }
    for(let key of Object.keys(position)){
        if (key.includes(opponentColor)===false) continue;
        directions=DirectionArrayHolder[key];
        for(let member of position[key]) moveCodes.push(collectMoves(member,directions,position));
    }
    return moveCodes;
}

function collectMoves(square,directions,position){
    let collectedMoves=[];
    for(let direction of directions){
        if(direction==="short-range" || direction==="long-range") continue;
        let range=directions[0];
        collectedMoves.push(generateMoves(square,range,direction,position));
    }
    return collectedMoves;
}

function generateMoves(square,range,direction,position){
    let attackMoves=[]
    var newLocation=[square[0]+direction[0],square[1]+direction[1]];
    while (newLocation[0]>-1 && newLocation[0]<8 && newLocation[1]>-1 && newLocation[1]<8){
        attackMoves.push([square,newLocation]);
        if (range==="short-range")break;
        if (belongsTo(position,newLocation)!=null) break;
        newLocation=[newLocation[0]+direction[0],newLocation[1]+direction[1]];
    }
    return attackMoves;        
}

function checkOccupant(square,opponentColor,position){
    let color;
    let occupancyStatus=0;
    let type=belongsTo(position,square);

    if (type===null) return occupancyStatus;
    color=(type.includes('white'))? 'white':'black';
    occupancyStatus=(color===opponentColor)? 2:1;
    return occupancyStatus;   
}

function belongsTo(position,square){
    for (let array of Object.entries(object)){
        if (array[1].contains(square)) return array[0]; 
    }
    console.log('square not found');
    return null;
}


function has (position,square){
    for (let array of Object.entries(position)){
        if (array[1].contains(square)) return true; 
    }
    return false;
}











let occuredOnce=[];
let occuredTwice=[];

function threeFoldStatusUpdate(sideToPlay,position){
    let repeatable=[sideToPlay,position];
    let positionString=JSON.stringify(repeatable);
    if (occuredOnce.contains(positionString)){
        occuredTwice.push(positionString);
        return;
    }
    if (occuredTwice.contains(positionString)){
        threeFoldDraw();
        return;
    }
    occuredOnce.push(positionString)
}



























