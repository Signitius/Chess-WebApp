import { gameState,collectLegalDestinations,makeMove } from "./oop";

const button1=document.querySelector('#button1');
const button2=document.querySelector('#button2');
const boardContainer=document.querySelector('#board-container');
const board=document.querySelector('#board');
const ranks=document.querySelectorAll('.rank');
const squares=document.querySelectorAll('.square');

button1.onclick=twoPlayer;
button2.onclick=chooseSide;

function updateBoard(){
    //eliminate all images
    let images=querySelectorAll("img");
    images.remove();
    for (let array of gameState.currentPosition){
        for (let locAtion of array){
            for (let member of squares){
                if (addressToCodes(member.id)==locAtion ){
                    let img=document.createElement("img");
                    switch(gameState.currentPosition.getkeys[array]){
                            
                        case "whitePawns":
                            img.src="wikipedia/wP.png";
                            member.appendChild(img);
                            break;
                        case "blackPawns":  
                            img.src="wikipedia/bP.png";
                            member.appendChild(img);
                            break;
                        case "whiteBishops":  
                            img.src="wikipedia/wB.png";
                            member.appendChild(img);

                            break;
                        case "blackBishops":  
                            img.src="wikipedia/bB.png";
                            member.appendChild(img);
                            break;
                        case "whiteKnights":  
                            img.src="wikipedia/wN.png";
                            member.appendChild(img);
                            break;
                        case "blackKnights":  
                            img.src="wikipedia/bN.png";
                            member.appendChild(img);
                            break;
                        case "whiteRooks":
                            img.src="wikipedia/wR.png";
                            member.appendChild(img);
                            break;
                        case "blackRooks":  
                            img.src="wikipedia/bR.png";
                            member.appendChild(img);
                            break;
                        case "whiteQueens":  
                            img.src="wikipedia/wQ.png";
                            member.appendChild(img);
    
                            break;
                        case "blackQueens":  
                            img.src="wikipedia/bQ.png";
                            member.appendChild(img);
                            break;
                        case "whiteKing":  
                            img.src="wikipedia/wK.png";
                            member.appendChild(img);
                            break;
                        case "blackKing":  
                            img.src="wikipedia/bK.png";
                            member.appendChild(img);
                            break;

                    
                    
                    
                    
                        }
                        break;
                }
            }
        }
    }
    
}



function chooseSide(){
    button1.textContent="play as white";
    button2.textContent="play as black";
    button1.onclick=whiteVsAi;
    button2.onclick=blackVsAi;
    

}


function shadeSquares(){
    var oddRank=true;
    for(var i=0;i<squares.length;i++){
        
        if (i%8==0){
            oddRank=!oddRank;
        }
        if(oddRank){
            if((i%2)==0){

                squares[i].style.backgroundColor="#769656";
                
            }
            else squares[i].style.backgroundColor="#eeeed2";
        }
        else{
            if((i%2)!=0){

                squares[i].style.backgroundColor="#769656";
            }
            else squares[i].style.backgroundColor="#eeeed2";
        }
        squares[i].addEventListener("click",highlight,{capture:true})
        
        
    }
}
function startup(){
    button1.textContent="Quit game";
    shadeSquares();
    
    boardContainer.style.display="block";
 

}
function twoPlayer(){
    button2.textContent="Rotate board";
    startup();
    button2.onclick=rotateBoard;
    
  
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
var currentSquare;
var currentPossibleDestinations;
let lastClicked;
function highlight(e){
    lastClicked=document.querySelector('.clicked');

    if(lastClicked) {
        lastClicked.classList.remove('clicked');
    }
    
    e.currentTarget.classList.add('clicked');
    if(lastClicked.firstElementChild){
        if(currentPossibleDestinations){
            for (move in currentPossibleDestinations){
                if (move[1]==addressToCodes(e.currentTarget.id)){
                    makeMove(addressToCodes(lastClicked.id),move,gameState.currentPosition);
                    checkStatus();
                    break;
                }
            }
        }
        
    }
    else{
        if(e.currentTarget.firstElementChild){
            currentSquare=addressToCodes(e.currentTarget.id);
            for (let array of gameState.currentPosition){
                if(currentSquare in array){
                    currentPieceType=gameState.currentPosition.getkeys[array];
                    break;
                }
            }
            currentPossibleDestinations=collectLegalDestinations(currentSquare);
            
        }
    }

        
}





















function rotateBoard(){

  
    if (board.style.flexDirection=="column-reverse"){
        board.style.flexDirection="column";
        for (let rank of ranks){
            rank.style.flexDirection="row";
        }
        
    }
    else{
        board.style.flexDirection="column-reverse";
        for (let rank of ranks){
            rank.style.flexDirection="row-reverse";
        }
    }
        
}



















