import { moveAccept } from "./logic";

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
    initialiseBoard();
    button2.onclick=rotateBoard; 
}

function initialiseBoard(){
    button1.textContent="Quit game";
    boardContainer.style.display="block";
    for (let square of squares) square.addEventListener("click",moveHandler);
}

function blackVsAi(){
    rotateBoard();
    button2.style.display="none";
    initialiseBoard(); 
}

function whiteVsAi(){
    button2.style.display="none";
    initialiseBoard();   
}

function rotateBoard(){
    board.style.flexDirection=(board.style.flexDirection=="column-reverse")? "column":"column-reverse";
    for (let rank of ranks) rank.style.flexDirection=(rank.style.flexDirection=="row-reverse")? "row":"row-reverse";   
}

let possibleMoves;
let alreadyClicked;

function moveHandler(e){
    highlighted=document.querySelector('.highlighted');
    if(highlighted)highlighted.classList.remove('.highlighted')
    if (alreadyClicked==null)originValidate(e.currentTarget);
    else destinationValidate(e.currentTarget); 
}

function originValidate(clickedSquare){
    for(move of possibleMoves){
        if(move[1][0]!=clickedSquare) continue;
        alreadyClicked=clickedSquare;
        break;
    }
}

function destinationValidate(clickedSquare){
    for(move of possibleMoves){
        if(move[1][1]!=clickedSquare) continue;
        return moveAccept();
    }
}

    