

const button1=document.querySelector('#button1');
const button2=document.querySelector('#button2');
const boardContainer=document.querySelector('#board-container');
const board=document.querySelector('#board');
const ranks=document.querySelectorAll('.rank');
const squares=document.querySelectorAll('.square');

button1.onclick=twoPlayer;
button2.onclick=chooseSide;





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
function highlight(e){
    let lastClicked=document.querySelector('.clicked');

    if(lastClicked) {
        lastClicked.classList.remove('clicked');
    }
    
    e.currentTarget.classList.add('clicked');
    if(lastClicked.firstElementChild){
        for (move in currentPossibleDestinations){
            if (move[1]==e.currentTarget.id) makeMove(lastClicked.id,move);
            break;
        }
    }
    else{
        if(e.currentTarget.firstElementChild){
            currentSquare=e.currentTarget.id;
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
function makeMove(origin,typeAndDestination){
    switch (typeAndDestination[0]){
        case 'empassant':
        case 'capture':
        case'normal':
        //case 'castling':
        case 'promotion':
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
//var images=document.querySelectorAll('img');
//for(img of images){
    
//}






