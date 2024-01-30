const button1=document.querySelector('#button1');
const button2=document.querySelector('#button2');
const boardContainer=document.querySelector('#board-container');
const board=document.querySelector('#board');
const ranks=document.querySelectorAll('.rank');
const squares=document.querySelectorAll('.square');
const darkSquares=document.querySelectorAll('.dark');
const lightSquares=document.querySelectorAll('.light');


button1.onclick=twoPlayer;
button2.onclick=chooseSide;



function chooseSide(){
    button1.textContent="play as white";
    button2.textContent="play as black";
    button1.onclick=whiteVsAi;
    button2.onclick=blackVsAi;
}

function twoPlayer(){
    button2.textContent="Rotate board";
    startup();
    button2.onclick=rotateBoard; 
}

function startup(){
    button1.textContent="Quit game";
    boardContainer.style.display="block";
    currentPossibleMoves=initialPossibleMoves;  
    //because of a move generation optimization trick where avoidsCheck() also generates opponent moves
}

function blackVsAi(){
    rotateBoard();
    button2.style.display="none";
    startup(); 
}

function whiteVsAi(){
    button2.style.display="none";
    startup();   
}

function rotateBoard(){
    board.style.flexDirection=(board.style.flexDirection=="column-reverse")? "column":"column-reverse";
    for (let rank of ranks) rank.style.flexDirection=(rank.style.flexDirection=="row-reverse")? "row":"row-reverse";   
}

let origin,highlighted;

for (let square of squares){
    square.addEventListener("click",highlight);
    square.addEventListener("click",moveHandler,);
}

function highlight(e){
    highlighted=document.querySelector('.highlighted');
    if(originValidation(e.currentTarget)) e.currentTarget.classList.add('highlighted');
    if(highlighted==null) return;
    highlighted.classList.remove('highlighted');       
}
//clear origin after a piece is moved
function originValidation(origin){
    if(!(origin)) return false;
    if (!(origin.firstElementChild )) return false;
    if(!(origin.firstElementChild.classList.contains(sideToPlay))) return false;
    return true;
}
let currentPossibleMoves=[];


function moveValidation(moveSquares){
    for (let move in currentPossibleMoves){
        if(move[1]==moveSquares && avoidsheck(move)) return true;
    }
}
function moveHandler(e){
    origin=document.querySelector('.origin');
    if(origin) origin.classList.remove('.origin');
    e.currentTarget.classList.add('.origin');
    if (originValidation(origin)==false) return;
    moveSquares=[idTocodes(origin.id),idTocodes(e.currentTarget.id)]
    if(moveValidation(moveSquares)==false) return;
    moveAccept();
    e.currentTarget.classList.remove('.origin');
}
const initialPossibleMoves=[["normal",[[0,1],[0,2]]],]

    