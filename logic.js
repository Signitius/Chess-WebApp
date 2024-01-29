export let gameState={
    sideToPlay:"white"
}

export function moveAccept(){
    updateStatus();
    updateBoard();
    checkStatus();
    moveGenerate();
}

export function idTocodes(id){}
function codesToId(){}


function updateBoard(){
    let images=querySelectorAll("img");
    images.remove();
    for (let entry of Object.entries(gameState.currentPosition)){
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
        if(source.contains(entry[0])==false) continue;
        let img=document.createElement("img");
        img.src=source;
        parentSquare.appendChild(img);      
    }
}
function updateStatus(){}
function checkStatus(){}
function moveGenerate(){}
export function avoidsCheck(){}