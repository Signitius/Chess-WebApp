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
}
function updateStatus(){}
function checkStatus(){}
function moveGenerate(){}
export function avoidsCheck(){}