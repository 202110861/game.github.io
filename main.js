//캔버스 세팅
let canvas;
let ctx;

canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas)


let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;

//우주선 좌표
let spaceshipX = (canvas.width - 60)/2;
let spaceshipY = canvas.height - 60;

let bulletList = []; //총알 저장 리스트
let enemyList = [];
let gameOver=false; //true 이면 게임이 끝남. false이면 게임이 계속 진행됨.
let score=0;

let isGameRunning = false;

function startGame(){
    if(!isGameRunning){
        resetGame(); //게임 상태 초기화
        isGameRunning=true;
        loadImage();
        setupKeyboardListener();
        createEnemy();
        main();
    }
}

//게임 상태 초기화 함수
function resetGame(){
    spaceshipX= (canvas.width - 60)/2;
    spaceshipY = canvas.height - 60;

    bulletList = [];
    enemyList = [];
    gameOver = false; 
    score = 0;
    isGameRunning = false; 
}


function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX+22;
        this.y = spaceshipY;
        this.alive=true; //ture 이면 살아있는 총알, false 면 죽은 총알

        bulletList.push(this);
    }

    this.update = function(){
        this.y-=7;
    }

    this.checkHit=function(){
        for(let i=0; i<enemyList.length;i++){
            if((this.x>=enemyList[i].x)&&(this.x<=enemyList[i].x+40)&&(this.y<=enemyList[i].y)){
                score++;
                this.alive=false;
                enemyList.splice(i,1); // i번째 리스트에 있는 값 1개를 제거
            }
        }
        

    }

}

function Enemy(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x= generateRandomValue(0, canvas.width-40);
        this.y=0;

        enemyList.push(this);
    }

    this.update = function(){
        this.y+=3;

        if(this.y>=canvas.height-40){
            gameOver=true;
        }
    }
}

function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;  //이 함수는 0~1 사이에서의 랜덤값
    return randomNum;
}

function loadImage(){

backgroundImage = new Image();
backgroundImage.src="images/background.jpg";

spaceshipImage = new Image();
spaceshipImage.src="images/spaceship.png";

bulletImage = new Image();
bulletImage.src="images/bullet.png";

enemyImage = new Image();
enemyImage.src = "images/enemy.png";

gameOverImage = new Image();
gameOverImage.src = "images/gameover.jpg";

}

let keysDown={};
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode]=true;
        
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];
        if(event.keyCode == 32){
            createBullet();

        }//32는 스페이스바
    });
}

function createBullet(){
    let b = new Bullet(); //총알 생성
    b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let a = new Enemy();
        a.init();
    },1000); //setInterval(호출하고 싶은 함수, 시간) 여기서 시간 단위는 ms 임으로 1s=1000ms

     //적 생성   
}



function update(){
    if(39 in keysDown){
        if(spaceshipX<canvas.width-60){
            spaceshipX+=5;
        }
    } //39는 오른쪽 버튼
    if(37 in keysDown){
        if(spaceshipX>0)
            spaceshipX-=5;
    } //37은 왼쪽 버튼


    //총알의 좌표 업데이트 하는 함수 호출
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
        
    }

    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(backgroundImage,0,0,canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX, spaceshipY);
    ctx.fillText('Score : '+score,20,20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x, bulletList[i].y);
        }
        
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y, 40,40);
    }

}


function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage,0,200,400,300);
        isGameRunning = false;
    }

    //!gameOver 은 gameOver==false 임.
   

}

document.getElementById('startButton').addEventListener('click',startGame);

/*
loadImage();
setupKeyboardListener();
createEnemy();
main();
*/
