//game status beginning


let sideToPlay="white"
let opponentColor="black"
let whiteKingMoved=false;
let whiteKingRookMoved=false;
let whiteQueenRookMoved=false;


let blackKingMoved=false;
let blackKingRookMoved=false;
let blackQueenRookMoved=false;
        
    
let _50MoveRuleCount=0;
        
        
let repeatablePastpositions=[];//each is a json string of its corresponding currentPosition with sideToPlay concatenated


let _4thRankWhitePawnHistory=[];// to help with empassant
let _5thRankBlackPawnHistory=[];
        
let currentPosition={
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
// game status end

export function moveAccept(move){
    updateStatus(createMoveObject(move));
    updateBoard();
    checkStatus();
}
function createMoveObject(move){}

function updateStatus(moveObject){
    positionUpdate();
    fiftyMoveRuleUpdate();
    empassantUpdate();
    castlingUpdate();
    threeFoldStatusUpdate();
    sideToPlayUpdate();
}

let move={
    type:"",piece:'',origin:"",pieceType:'',destination:''
}

function checkStatus(){
    newTurn();
    if(isCheckmate()) return endGame("checkmate");
    if(isStalemate()) return endGame("stalemate");
    if(isFiftyMoveDraw()) return endGame("fiftyMoveDraw");
    if(isThreeFoldDraw()) return endGame("threeFoldDraw");
    if(isMateImpossibilityDraw()) return endGame("mateImpossibilityDraw");
   
}
function endGame(){}
function positionUpdate(){}
function fiftyMoveRuleUpdate(moveObject){
    _50MoveRuleCount+=0.5;
    if (moveObject.piece=="pawn" || moveObject.type=="capture")_50MoveRuleCount=0;
    if (isCheck(currentPosition))_50MoveRuleCount=0;
}
function empassantUpdate(moveObject){
    
    if(moveObject.piece!="pawn")return;
    if(moveObject.color=="white")_4thRankWhitePawnHistory=[];
    else _5thRankBlackPawnHistory=[];
    if(moveObject.color=="white" && moveObject.destination[1]==3 && moveObject.origin[1]==1){
        _4thRankWhitePawnHistory.push(moveObject.destination);
        return;
    }
    if(moveObject.color=="black" && moveObject.destination[1]==4 && moveObject.origin[1]==6){
        _5thRankBlackPawnHistory=[];
        _5thRankBlackPawnHistory.push(moveObject.destination);
        return;
    }
}
function castlingUpdate(moveObject){
    if (moveObject.piece=="whiteKing")whiteKingMoved=true;
    if (moveObject.piece=="blackKing")whiteKingMoved=true;
    if (moveObject.piece=="whiteRook" && moveObject.origin[0]==0)whiteKingRookMoved=true;
    if (moveObject.piece=="whiteRook")whiteKingMoved=true;
    if (moveObject.piece=="whiteKing")whiteKingMoved=true;
    if (moveObject.piece=="whiteKing")whiteKingMoved=true;
//do the necessary editing
}
function positionUpdate(moveObject){
    //implement pawn promotion
}
let colorSwap=sideToPlay;
function sideToPlayUpdate(){
    sideToPlay=opponentColor;
    opponentColor=colorSwap;
    colorSwap=sideToPlay;
}




function isCheckmate(){
    if(possibleMoves.length!=0) return false;
    if(isCheck(currentPosition)==true)return true;
}
function isStalemate(){
    if(possibleMoves.length!=0) return false;
    if(isCheck(currentPosition)==false)return true;
}
function isFiftyMoveDraw(){
    if(_50MoveRuleCount==50) return true;
    return false;
}
function isThreeFoldDraw(){
    if(threeFoldDrawn==true) return true;
    return false;
}
function isMateImpossibilityDraw(){
    if(currentPosition.blackQueen.length!=0)return false;
    if(currentPosition.whiteQueen.length!=0)return false;
    if(currentPosition.blackRook.length!=0)return false;
    if(currentPosition.whiteRook.length!=0)return false;
    if(currentPosition.whitePawn.length!=0)return false;
    if(currentPosition.blackPawn.length!=0)return false;

    if(currentPosition.blackBishop.length==2)return false;
    if(currentPosition.whiteBishop.length==2)return false;
    if(currentPosition.blackBishop.length==1 && currentPosition.blackKnight==1)return false;
    if(currentPosition.whiteBishop.length==1 && currentPosition.whiteKnight==1)return false;

    return true;
}


export let possibleMoves=[];


export function newTurn(){
    let newPossibleMoves=[];
    newPossibleMoves.push(generalMoves(currentPosition));
    newPossibleMoves.push(specialMoves());
    possibleMoves=newPossibleMoves;
    
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
    "wikipedia/blackQueen.png","wikipedia/blackKing.png","wikipedia/blackPawn.png",
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


let futurePosition;

export function avoidsCheck(move){
    futurePosition=JSON.parse(JSON.stringify(currentPosition));
    positionUpdate();(move,futurePosition);
    return !(isCheck(color,futurePosition));
}

function isCheck(color,position){
    let kingPosition,opponentColor;
    if(color==="white"){
        kingPosition=position["whiteKing"][0];
        opponentColor='black'
    }
    if(color==="black"){
        kingPosition=position["blackKing"][0];
        opponentColor='white';
    }

    return isAttacked(opponentColor,kingPosition,position);      
}

function isAttacked(enemyColor,square,position){
    let attacked=attacks(enemyColor,position);
    for(let member of attacked){
        if(member[1]===square)return true;
    }
    return false ;
}
function areAttacked(enemyColor,squareList,position){
    let attacked=attacks(enemyColor,position);
    let attackedDestinations=destinations(attacked);
    for(let member of squareList){
        for(let attacked of attackedDestinations){
            if (attacked==member)return false;

        }
    }
    return true ;
}

function destinations(moveList){
    for (let moveCodes of moveList){
        let origin=moveCodes.splice(0,1);
        
    }
    return moveList;
}

const boardMapping={
    a1:[0,0],b1:[1,0],c1:[2,0],d1:[3,0],e1:[4,0],f1:[5,0],g1:[6,0],h1:[7,0],
    a2:[0,1],b2:[1,1],c2:[2,1],d2:[3,1],e2:[4,1],f2:[5,1],g2:[6,1],h2:[7,1],
    a3:[0,2],b3:[1,2],c3:[2,2],d3:[3,2],e3:[4,2],f3:[5,2],g3:[6,2],h3:[7,2],
    a4:[0,3],b4:[1,3],c4:[2,3],d4:[3,3],e4:[4,3],f4:[5,3],g4:[6,3],h4:[7,3],
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


function generalMoves(position){
    let moveArray=[];
    let attacked=attacks(sideToPlay,position);
    for(let moveCodes of attacked){
        if(checkOccupant(moveCodes[1])===1){
            moveArray.push(["capture",moveCodes]);
            continue;
        }
        //eliminate pawn diagonal movement if not capture
        if (belongsTo(position,moveCodes[0])==="whitePawn"||belongsTo(position,moveCodes[0])==="blackPawn") continue;
        if(checkOccupant(moveCodes[1])===0) moveArray.push(["normal",moveCodes]);

    }
    
    return moveArray;
}


function specialMoves(){
    let specialMoveList=[];
    if(sideToPlay=='white'){
        specialMoveList.push(specialPawnMoves('whitePawn'));
        specialMoveList.push(castleMoves('white'));
    }
    else {
        specialMoveList.push(specialPawnMoves('blackPawn'));
        specialMoveList.push(castleMoves('black'))
    }
    return specialMoveList;
}

function specialPawnMoves(key,position=currentPosition){
    let specialPawnMoveMoveList=[];
    for(let square of position[key]){
        specialPawnMoveMoveList.push(collectPawnMoves(square,key))
    }
    return specialPawnMoveMoveList;
}

function collectPawnMoves(square,key){
    let moveArray=[];
    let pieceTransfer,oneStepAbove,twoStepsAbove,leftUpperCorner,rightUpperCorner,startrank,empassantRank,rankPawnHistory;;
    let oneStepLeft=[square[0]-1,square[1]];
    let oneStepRight=[square[0]+1,square[1]];
    
    if(key=='whitePawn'){
        oneStepAbove=[square[0],square[1]+1];
        twoStepsAbove=[square[0],square[1]+2];  
        leftUpperCorner=[square[0]-1,[1]+1];
        rightUpperCorner=[square[0]+1,[1]+1]; 
        startrank=1;
        empassantRank=5;
        rankPawnHistory=_5thRankBlackPawnHistory;
    }
    else{
        oneStepAbove=[square[0],square[1]-1];
        twoStepsAbove=[square[0],square[1]-2];
        leftUpperCorner=[square[0]-1,[1]-1];
        rightUpperCorner=[square[0]+1,[1]-1]; 
        startrank=6;
        empassantRank=4;
        rankPawnHistory=_4thRankWhitePawnHistory;
    }
    if(oneStepLeft[0]===-1) oneStepLeft=null;
    if(oneStepRight[0]===8) oneStepRight=null;
    // they also represent the case for left and right corners

    //two squares up on first move
    if(square[1]=startrank && checkOccupant(oneStepAbove)==0 && checkOccupant(twoStepsAbove)==0){
        pieceTransfer=["normal",[square,twoStepsAbove]];
        moveArray.push(pieceTransfer);    
        
    }
    //one square up 
    if(checkOccupant(oneStepAbove)==0){
        pieceTransfer=["normal",[square,oneStepAbove]];
        moveArray.push(pieceTransfer); 
    }
    
    //empassant
    if(square[1]!=empassantRank)return moveArray;
    if(oneStepLeft && oneStepLeft in rankPawnHistory===false && checkOccupant(oneStepLeft)==1){
        pieceTransfer=["empassant",[square,leftUpperCorner]];
        moveArray.push(pieceTransfer);
    }
    if( oneStepRight && oneStepRight in rankPawnHistory===false && checkOccupant(oneStepRight)==1){
        pieceTransfer=["empassant",[square,rightUpperCorner]];
        moveArray.push(pieceTransfer);
    } 
    return moveArray;
}

//castling
let whiteKingCastleList=[[4,0],[5,0],[6,0]]   //e1,f1,g1 squares
let blackKingCastleList=[[4,7],[5,7],[6,7]]

let whiteQueenCastleList=[[4,0],[3,0][2,0],[1,0]]
let blackQueenCastleList=[[4,7],[3,7][2,7],[1,7]]

function castlingValid(attackCheckList,kingMoved,rookMoved){
    if(areAttacked(opponentColor,attackCheckList,currentPosition)) return false;
    if(kingMoved || rookMoved) return false;
    for (let square of attackCheckList){
        if(square==[4,0] || square==[4,7])continue;
        if(checkOccupant(square)!=0) return false;
        //checkOccupant() has 3 possible return values
    }
    return true;         
}

function castleMoves(color){
    let castleMoveList;
    if(color=='white'){
        if(castlingValid(whiteKingCastleList,whiteKingMoved,whiteKingRookMoved))castleMoveList.push(['whiteKingCastle',[[4,0],[6,0]]]);
        if(castlingValid(whiteQueenCastleList,whiteKingMoved,whiteQueenRookMoved))castleMoveList.push(['whiteQueenCastle',[[4,0],[1,0]]]);
    }
    else{
        if(castlingValid(blackKingCastleList,blackKingMoved,blackKingRookMoved))castleMoveList.push(['blackKingCastle',[[4,7],[6,7]]]);
        if(castlingValid(blackQueenCastleList,blackKingMoved,blackQueenRookMoved))castleMoveList.push(['blackQueenCastle',[[4,7],[1,7]]]);
    }
    return castleMoveList;
}
    

function attacks(color,position){
    let attackCodes=[];
    let directions=[];
    let directionArrayHolder={
        //duplication endured to match properties (and property order) to those in currentPosition for faster association
        whitePawn:['short-range',[-1,1],[1,1]],
        blackPawn:['short-range',[-1,-1],[1,-1]],
        whiteBishop:["long-range",[-1,1],[1,1],[1,-1],[-1,-1]],
        blackBishop:["long-range",[-1,1],[1,1],[1,-1],[-1,-1]],
        whiteKnight:["short-range",[-2,1],[-2,-1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]],
        blackKnight:["short-range",[-2,1],[-2,-1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]],
        whiteRook:["long-range",[0,1],[-1,0],[1,0],[0,-1]],
        blackRook:["long-range",[0,1],[-1,0],[1,0],[0,-1]],
        whiteQueen:["long-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
        blackQueen:["long-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
        whiteKing:["short-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
        blackKing:["short-range",[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[1,-1],[-1,-1]],
    }
    for(let key of Object.keys(position)){
        if (key.includes(color)===false) continue;
        directions=directionArrayHolder[key];
        for(let member of position[key]) attackCodes.push(collectMoves(member,directions,position))
    }
    return attackCodes;
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
    let attacks=[]
    var newLocation=[square[0]+direction[0],square[1]+direction[1]];
    while (newLocation[0]>-1 && newLocation[0]<8 && newLocation[1]>-1 && newLocation[1]<8){
        attacks.push([square,newLocation]);
        if (range==="short-range")break;
        if (belongsTo(position,newLocation)!=null) break;
        newLocation=[newLocation[0]+direction[0],newLocation[1]+direction[1]];
    }
    return attacks;        
}

function checkOccupant(square,color=sideToPlay,position=currentPosition){
    let occupancyStatus=0;
    let type=belongsTo(position,square);

    if (type===null) return occupancyStatus;
    color=(type.includes('white'))? 'white':'black';
    occupancyStatus=(color===color)? 2:1;
    return occupancyStatus;   
}

function belongsTo(position,square){
    
    for(let array of Object.entries(position)){
        for(let box of array[1]){
            if(box==square){
                console.log(array[0]);
                return array[0];
        }   }
    }
    return null;
}


function has (position,square){
    let positionString=JSON.stringify(position);
    let squareString=JSON.stringify(square);
    if (positionString.includes(squareString)) return true;
    return false;
}











let occuredOnce=[];
let occuredTwice=[];
let threeFoldDrawn=false;
//occurs after positionUpdate() and sideToPlayUpate();
function threeFoldStatusUpdate(){
    let repeatable=[sideToPlay,position];
    let positionString=JSON.stringify(repeatable);
    if (occuredTwice.contains(positionString)){
        threeFoldDrawn=true;
        return;
    }
    if (occuredOnce.contains(positionString)){
        let index=occuredOnce.indexOf(positionString);
        occuredOnce.splice(index,1);
        occuredTwice.push(positionString);
        return;
    }
    
    occuredOnce.push(positionString);
}

function resetThreeFold(){
    //after a capture or promotion, or pawn move
}


function contains(array1,array2){
    let stringArray1;
    let stringArray2=JSON.stringify(array2);
    for (let item of array1){
        stringArray1=JSON.stringify(item);
        if(stringArray1==stringArray2) return true;
    }
    return false;
}