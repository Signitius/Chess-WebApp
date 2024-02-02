import { moveAccept, newTurn,possibleMoves } from "./logic.js";

const button1=document.querySelector('#button1');
const button2=document.querySelector('#button2');
const boardContainer=document.querySelector('#board-container');
const board=document.querySelector('#board');
const ranks=document.querySelectorAll('.rank');
const squares=document.querySelectorAll('.square');
const darkSquares=document.querySelectorAll('.dark');
const lightSquares=document.querySelectorAll('.light');







function begin(){
    button1.onclick=twoPlayer;
    button2.onclick=chooseSide;
}
begin();



function chooseSide(){
    button1.textContent="play as white";
    button2.textContent="play as black";
    button1.onclick=whiteVsAi;
    button2.onclick=blackVsAi;
}


function twoPlayer(){
    button2.textContent="Rotate board";
    button2.onclick=rotateBoard; 
    initialiseBoard();
}


function initialiseBoard(){
    button1.textContent="Quit game";
    boardContainer.style.display="block";
    newTurn();
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







let alreadyClicked , highlighted;

function moveHandler(e){
    highlighted=document.querySelector('.highlighted');
    if(highlighted)highlighted.classList.remove('.highlighted')
    if (alreadyClicked==null)originValidate(e.currentTarget);
    else destinationValidate(e.currentTarget); 
}

function originValidate(clickedSquare){
    for( let move of possibleMoves){
        if(move[1][0]!=clickedSquare) continue;
        clickedSquare.classList.add('.highlighted')
        alreadyClicked=clickedSquare;
        break;
    }
}

function destinationValidate(clickedSquare){
    for(move of possibleMoves){
        if(move[1][1]!=clickedSquare) continue;
        return moveAccept(move);
    }
}




/*themes
natureTheme={
    darkSquares:'',lightSquares:'',boardContainer:'', moveSound:''
}
funnyTheme={}

function changeTheme(){}*/



    