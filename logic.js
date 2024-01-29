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


function updateBoard(){
    let images=querySelectorAll("img");
    images.remove();
    for (let entry of Object.entries(gameState.currentPosition)) updateType(entry);
}

function updateType(entry){
    let imageSources=["wikipedia/blackRook.png","wikipedia/blackKnight.png","wikipedia/blackBishop.png",
    "wikipedia/blackQueen.png","wikipedia/blackKing.png","wikipedia/blackPawhiteKnight.png",
    "wikipedia/whitePawn.png","wikipedia/whiteRook.png","wikipedia/whiteKnight.png",
    "wikipedia/whiteBishop.png","wikipedia/whiteQueen.png","wikipedia/whiteKing.png"]
    for (let location of entry[1]){

    }
}
function updateStatus(){}
function checkStatus(){}
function moveGenerate(){}
export function avoidsCheck(){}