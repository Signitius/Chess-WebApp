

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
let lastClicked;
function highlight(e){
    lastClicked=document.querySelector('.clicked');

    if(lastClicked) {
        lastClicked.classList.remove('clicked');
    }
    
    e.currentTarget.classList.add('clicked');
    if(lastClicked.firstElementChild){
        for (move in currentPossibleDestinations){
            if (move[1]==e.currentTarget.id) makeMove(move,gameState.currentPosition);
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
function makeMove(typeAndDestination,position){
    switch (typeAndDestination[0]){
        case 'empassant': empassant(typeAndDestination[1],position);
        case 'capture': capture(typeAndDestination[1],position);
        case'normal': generalMover(typeAndDestination[1],position);
        case 'whitecastling-Queenside': whiteKingCastle(position);
        case'blackcastling-kingside': whiteQueenCastle(position);
        case 'whitecastling-kingside': blackKingCastle(position);
        case 'blackcastling-Queenside': blackQueenCastle(position);
        case 'promotion': promotion(typeAndDestination[1],position);
        case 'promotional capture': promotionalCapture(typeAndDestination[1],position);
    }

function generalMover(move,position){
    for(array of position){
        if (lastClicked in array){
            array[array.indexof(lastClicked)]=move;
            break;

        }
    }
}
function empassant(move,position){
    generalMover(move);
    let below=[move[0],move[1]-1];
    for(array of position){
        if (below in array){
            array.splice(array.indexof(below),1);
            break;

        }
    }
    

}
function capture(move,position){
    
    for(array of position){
        if (move in array){
            array.splice(array.indexof(move),1);
            break;

        }
    }
    generalMover(move);
}
function promotion(move,position){
    for(array of position){
        if (lastClicked in array){
            array.splice(array.indexof(lastClicked),1);
            break;

        }
    }
    for(arrayProperty in gameState.position){
        if (arrayProperty.includes('Queen') && arrayProperty.includes(currentPieceColor)){
            array["arrayProperty"].push(move);
            break;

        }
    }
    //auto queen promotion for now. must change it later
}
function promotionalCapture(move,position){
    for(array of position){
        if (move in array){
            array.splice(array.indexof(move),1);
            break;

        }
    }
    promotion(move);
}

function whiteKingCastle(position){
    let rookSwap=position.whiteRooks.indexOf([7,0])
    position.whiteRooks[rookSwap]=[5,0];
    position.whiteKing[0]=[6,0];
}
function whiteQueenCastle(position){
    let rookSwap=position.whiteRooks.indexOf([0,0])
    position.whiteRooks[rookSwap]=[3,0];
    position.whiteKing[0]=[2,0];
}
function blackKingCastle(position){
    let rookSwap=position.whiteRooks.indexOf([7,7])
    position.whiteRooks[rookSwap]=[5,7];
    position.whiteKing[0]=[6,7];
}
function blackQueenCastle(position){
    let rookSwap=position.whiteRooks.indexOf([0,7])
    position.whiteRooks[rookSwap]=[3,7];
    position.whiteKing[0]=[2,7];
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






