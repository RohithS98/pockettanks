var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//define all variables
var width = canvas.width;
var height = canvas.height;
var terrainY = new Array();
var weapons = [[8,7,"blue", "Regular",10], [11,5,"red","Medium",20],
               [14,3,"black", "Large",30]];

//Hello

// function Angle(a1){
//     var start = 4.72;
//     var cw = ctx.canvas.width/2 + 60;
//     var ch = ctx.canvas.height - 60;
//     var diff;
//     var bar = setInterval(progressBar(a1),50);
    
//     function progressBar(al){
//         diff=(al/100)*Math.PI*2;
//         ctx.beginPath();
//         ctx.arc(cw,ch,width*0.0416,0,2*Math.PI,false);
//         ctx.fillStyle='#FFF';
//         ctx.fill();
//         ctx.strokeStyle='#e7f2ba';
//         ctx.stroke();
//         ctx.fillStyle='#000';
//         ctx.strokeStyle='#b3cf3c';
//         ctx.textAlign='center';
//         ctx.lineWidth=15;
//         ctx.font = '10pt Verdana';
//         ctx.beginPath();
//         ctx.arc(cw,ch,width*0.0416,start,diff+start,false);
//         ctx.stroke();
//         ctx.fillText(al*180/100,cw+2,ch+6);
//         if(al>=50){
//             clearTimeout(bar);
//         }
//     }
// }
     
// function drawPowerBar(p1){
//     var start=4.72;
//     var cw=ctx.canvas.width/2;
//     var ch=ctx.canvas.height/2;
//     var diff;
//     var bar=setInterval(progressBar(p1),50);
//     function progressBar(p1){
//         diff=(p1/100)*Math.PI*2;
//         ctx.beginPath();
//         ctx.arc(width/2 - 60,height-60,width*0.0416,0,2*Math.PI,false);
//         ctx.fillStyle='#FFF';
//         ctx.fill();
//         ctx.strokeStyle='#e7f2ba';
//         ctx.stroke();
//         ctx.fillStyle='#000';
//         ctx.strokeStyle='#b3cf3c';
//         ctx.textAlign='center';
//         ctx.lineWidth=15;
//         ctx.font = '10pt Verdana';
//         ctx.beginPath();
//         ctx.arc(width/2 - 60,height-60,width*0.0416,start,diff+start,false);
//         ctx.stroke();
//         ctx.fillText(p1,width/2 - 58,height-54);
//         if(p1>=50){
//             clearTimeout(bar);
//         }
//     }
// }
    

function tank(playerNo){
    this.player = playerNo;
    this.weapon = 0;
    this.points = 0;
    this.movesLeft = 75;
    this.power = 70;
    this.tooSteep = false;
    if(this.player == 1){
        this.px = 60;
        this.theta = Math.PI/4;
    }
    else{
        this.px = 1100;
        this.theta = 3*Math.PI/4;
    }
    this.getplayer= function(){return this.player}
    this.angle = function(){return this.theta+this.phi}
    this.setpx = function(x){this.px = x}
    this.getpx = function(){return this.px}
    this.setpy = function(y){this.py = y}
    this.getpy = function(){return terrainY[this.px]}

    this.setnx = function(x){this.nx = x}
    this.getnx = function(){return this.nx}
    this.setny = function(y){this.ny = y}
    this.getny = function(){return this.ny}
        
    this.settheta = function(x){this.theta = x}
    this.gettheta = function(){return this.theta}

    this.setphi = function(x){this.phi = x}
    this.getphi = function(){return this.phi}

    this.setpoints = function(x){this.points = x}
    this.getpoints = function(){return this.points}

    this.seti = function(x){this.i = x}
    this.geti = function(){return this.i}

    this.changeWeapon = function(){this.weapon = (this.weapon+1)%3;}
    this.getweapon = function(){return this.weapon;}

    this.getmoves = function(){return this.movesLeft}
    this.moved = function(){this.movesLeft = this.movesLeft-1}

    this.toosteep = function(){this.steepbool = true}
    this.notsteep = function(){this.steepbool = false}
    this.steep = function(){return this.steepbool}

    this.getpower = function(){return this.power}
    this.setpower = function(tpower){this.power = tpower;}
}

var tank1 = new tank(1);
var tank2 = new tank(2);
var curPlayer = 1;
var prevPlay = false;

var gamePaused = false;
var gamePlay = false;
var gameStarted = false;

var gravity = .02;
var rally = 0;
var volley = 1;

//images
var bg = new Image();
var bgi = new Image();

bg.src = 'assets/img/bg1.jpg';
bgi.src = 'assets/img/canvasbg.jpg';

function circle(ctx, cx, cy, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();
}

var point =  function(x,y){
    this.x =  x;
    this.y =  y;
}

var midPoint =  function(p1, p2) {
    return new point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function randRange(min,max){
    var rand =  Math.floor(Math.random()*(max-min))+min; 
    return rand;
}

function generatePoints(width) {
    var displacement = 300;//mxm height of terrainY to be displaced above base line
    points =  [];
    var temp =  [];
    points[0] =  new point(0, 0 + base);
    points[1] =  new point(width, 0 + base);

    for(var i =  0; i < iterations; i++){
        temp =  [];
        for(var j =  0; j < points.length - 1; j++){
            var p1 =  points[j];
            var p2 =  points[j+1];
            var mid =  midPoint(p1, p2);
            if(mid.x > canvas.width / 3 && mid.x < canvas.width * 0.66){
                mid.y += randRange( -displacement, -displacement / 2);
            }
            else{
                mid.y += randRange(-displacement / 10, -displacement / 25);
            }
            temp.push(p1, mid);
        }
        temp.push(points[points.length - 1]);
        displacement *=  roughness/5;
        points =  temp;
    }
    return points;
}

function generate() {
    generatePoints(width);
    len =  points.length;
}

function drawTerrain(){
    console.log(bg);
    ctx.drawImage(bg,0,0,width,height);
    for (var i = 0; i <= width; i++){
        my_grad=ctx.createLinearGradient(0,terrainY[i],0,900);
        my_grad.addColorStop(0,"green");
        my_grad.addColorStop(0.07,"darkgreen");
        my_grad.addColorStop(0.2,"#A0522D");
        my_grad.addColorStop(0.7,"#8B4513");
        ctx.fillStyle= my_grad;
        ctx.fillRect(i,Math.floor(terrainY[i]),1,height-terrainY[i]);
    }
}

function endGame(loser = 0){
    gameStarted = false;
    gamePaused = false;
    gamePlay = false;
    setTimeout(function(){
        ctx.clearRect(0,0,width,height);
        ctx.drawImage(bgi,0,0,width,height);
        ctx.fillStyle= "white";
        ctx.font="80px Georgia";
        ctx.fillText("Game Over!", width/2-190, height/2-100);
        if(loser != 0){
            if(loser.getplayer() ==1){var winner = 2}
            else{var winner = 1;}
            ctx.font="60px Georgia";
            ctx.fillText("Player "+ winner + " Won!" , width/2-170,height/2);
        }
        else {
            ctx.font="60px Georgia";
            ctx.fillText("Draw!" , width/2-90,height/2);
        }
        ctx.fillText("Press 'r' to restart!", width/2-220,height/2+100);
    },2000);
}

function startGame(){
    gameStarted = true;
    curPlayer = 1;
    rally = 0;
    volley = 1;
    //
    drawTerrain();
    tank1 = new tank(1);
    tank2 = new tank(2);
    curPlayer = tank1;
    otherPlayer = tank2;
    createTanks(curPlayer,otherPlayer);
    drawTank(curPlayer);
    drawTank(otherPlayer);
    gamePaused = false;
    gamePlay = true;
    redraw();
}

function pauseGame(){
    if(gamePaused==false){
        prevPlay = gamePlay;
        gamePaused = true;
        gamePlay = false;
    }
    else{
        gamePaused = false;
        gamePlay = prevPlay;
    }
}

function drawPauseScreen(){
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(100,130,1000,400);
    ctx.globalAlpha = 1;
    ctx.fillStyle= "white";
    ctx.font="40px Georgia";
    ctx.fillText("Game Paused!", width/2-135, 200);
    popUp();
}

function popUp(){
    ctx.fillStyle = "white";
    ctx.font="25px Georgia";
    ctx.fillText("Aim & Instructions:", 200, 250);
    ctx.fillText("Controls:", 700, 250);
    ctx.font="18px Georgia";
    ctx.fillText("Fire weapons against your opponent to lower their health.", 200, 275);
    ctx.fillText("Direct hits will have the most impact.", 200, 300);
    ctx.fillText("The different weapons have different speeds and size.", 200, 325);
    ctx.fillText("The weapons with the largest size will have the most impact.", 200, 350);
    ctx.fillText("You have a limited number of moves; so use them wisely.", 200, 375);
    ctx.fillText("There are a total of 10 volleys.", 200, 400);
    ctx.fillText("The last tank standing wins!", 200, 425);
    ctx.fillText("Hit the SpaceBar to fire!", 700, 275);
    ctx.fillText("Left and right arrows will move the tank.", 700, 300);
    ctx.fillText("Up and down arrows will rotate the Turret." , 700, 325);
    ctx.fillText("'A' and 'D' will adjust the power." , 700, 350);
    ctx.fillText("Press 'W' to change your weapon.", 700, 375);
    ctx.fillText("Press 'P' to pause the game.", 700, 400);
    ctx.fillText("Press 'R' to restart the game.", 700, 425);
}

function createTanks(curPlayer,otherPlayer){
    curPlayer.setpy(terrainY[curPlayer.getpx()]-20);
    otherPlayer.setpy(terrainY[curPlayer.getpx()]-20);
}

//This function draws the tanks
function drawTank(tank){
    if(tank.getplayer() == 1)  
        ctx.fillStyle = "red";
    else
        ctx.fillStyle = "blue"

    //body of player
    ctx.beginPath();
    ctx.moveTo(tank.getpx(),terrainY[tank.getpx()]);
    tank.seti(30);
    for(i=0; i<=30; i++){
        if(Math.sqrt((i*i)+(terrainY[tank.getpx()+i]-terrainY[tank.getpx()])*(terrainY[tank.getpx()+i]-terrainY[tank.getpx()]))<=31 &&
           Math.sqrt((i*i)+(terrainY[tank.getpx()+i]-terrainY[tank.getpx()])*(terrainY[tank.getpx()+i]-terrainY[tank.getpx()]))>=29){
            tank.seti(i);
            break;
        }
    }
    tank.setphi(Math.acos(i/30));
    changeDelta(tank);
    if(terrainY[tank.getpx()+i]>terrainY[tank.getpx()]){tank.setphi(2*Math.PI-tank.getphi());}
    ctx.lineTo(tank.getpx()+i,terrainY[tank.getpx()+i]);
    ctx.lineTo((tank.getpx()+tank.geti())-20*Math.sin(tank.getphi()),(terrainY[tank.getpx()+tank.geti()])-20*Math.cos(tank.getphi()));
    ctx.lineTo(tank.getpx()-20*Math.sin(tank.getphi()),terrainY[tank.getpx()]-20*Math.cos(tank.getphi()));
    ctx.closePath();
    ctx.fill();
  
    var midx1= tank.getpx()+25*Math.cos(0.927293432+tank.getphi()); //0.927293432 is the angle in a 3:4:5 Triangle
    if(terrainY[tank.getpx()] >terrainY[tank.getpx()+tank.geti()]){
        var midy1=terrainY[tank.getpx()]-Math.abs(25*Math.sin((0.696706709+tank.getphi())%Math.PI));
    }
    else{
        var midy1=terrainY[tank.getpx()+tank.geti()]-Math.abs(25*Math.cos(Math.abs(0.927293432+tank.getphi())));
    }
    ctx.beginPath();
    ctx.arc(midx1,midy1, 8, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();

   
    //turret
    ctx.beginPath();
    mx = midx1-3*Math.sin(tank.gettheta());
    my = midy1-3*Math.cos(tank.gettheta());
    ctx.moveTo(mx, my);
    ctx.lineTo(mx+6*Math.sin(tank.angle()),my+6*Math.cos(tank.angle()));
    ctx.lineTo((mx+6*Math.sin(tank.angle()))+25*Math.cos(tank.angle()),(my+6*Math.cos(tank.angle()))-25*Math.sin(tank.angle()));
    ctx.lineTo(mx+25*Math.cos(tank.angle()),my-25*Math.sin(tank.angle()));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='black';
    ctx.stroke();
    tank.setnx(mx+25*Math.cos(tank.angle()));
    tank.setny(my-25*Math.sin(tank.angle()));
    
}

//this function changes the angle of the Turret
function rotateTurret(curPlayer, dir){
    if(curPlayer.getplayer()==2){
        dir= -dir;
    }
    if((dir*0.01+curPlayer.gettheta())%(2*Math.PI)>=0 && (dir*0.01+curPlayer.gettheta())%(2*Math.PI)<= Math.PI){
        curPlayer.settheta((dir*0.01+curPlayer.gettheta())%(2*Math.PI));
    }
    else if((dir*0.01+curPlayer.gettheta())%(2*Math.PI)<0){
        curPlayer.settheta(0);
    }
        else if((dir*0.01+curPlayer.gettheta())%(2*Math.PI)>Math.PI){
        curPlayer.settheta(Math.PI);
    }
}

//this function moves the tank
function moveTank(curPlayer, dir){
    if(curPlayer.getmoves() != 0){
        curPlayer.setpx(curPlayer.getpx()+dir);
        delta = Math.abs(terrainY[curPlayer.getpx()]-terrainY[curPlayer.getpx()+curPlayer.geti()]);
        if(delta>25){
            curPlayer.setpx(curPlayer.getpx()-dir);
            curPlayer.toosteep();    
        }
        else{
            curPlayer.notsteep();
            curPlayer.moved();
        }
    }
}

function changeDelta(victim){
    delta = Math.abs(terrainY[victim.getpx()]-terrainY[victim.getpx()+victim.geti()/2]);  
    while(delta>25){
        if(victim.getplayer() == 2){
            victim.setpx(victim.getpx()+5);
        }
        else{
            victim.setpx(victim.getpx()-5);
        }
        delta = Math.abs(terrainY[victim.getpx()]-terrainY[victim.getpx()+victim.geti()]);
    }
}
//this function launches the cannon
function launch(){
    gamePlay = false;
    weapon = curPlayer.getweapon();
    var t = 0;
    var x = curPlayer.getnx();
    var y = curPlayer.getny();
    var clear = false;
    var ani = setInterval(function(){projectile()}, 10);

    function projectile(){
        if(gamePaused== false){
            t+=1;
            redraw();
            if(y<terrainY[Math.round(x)] && x<=width && x>=0&&clear==false){
                x = curPlayer.getnx() + weapons[weapon][1]*Math.cos(curPlayer.angle())*curPlayer.getpower()*t/100;//percentage of power
                y = curPlayer.getny() - weapons[weapon][1]*Math.sin(curPlayer.angle())*curPlayer.getpower()*t/100 + (0.5*gravity)*(t*t);
                circle(ctx, x, y,weapons[weapon][0],weapons[weapon][2]);
                clear = checkDirectHit(x,y,otherPlayer);
            }
            else 
                if((y>terrainY[Math.round(x)] || x>width || x<0) && clear ==false){
                    explode(x,y,weapons[weapon][0]*2,otherPlayer);
                    clear = true;
                }
        }
       
        if(clear==true){
            clearInterval(ani);
            if(curPlayer.getplayer()==1){
                curPlayer = tank2;
                otherPlayer = tank1;
            }
            else{
                curPlayer = tank1;
                otherPlayer = tank2; 
            }
            gamePlay=true;
             ++rally;
            if(rally%2==0 && rally!=0)++volley;
           
            redraw();
        }
    }
}

//this function makes a hole in the terrain where the weapon lands
function explode(x,y,radius,player){
    x = Math.round(x);
    y = Math.round(y);
    for(i=x-radius;i<x+radius; i++){
        terrainY[i]=Math.max(y+Math.sqrt((radius*radius)-(x-i)*(x-i)),terrainY[i]);
    }
    checkIndirectHit(x,y,radius,player);
   
}

//this function checks if the weapon hits the tank
function checkDirectHit(cx,cy,victim){
    
    
    weapon = curPlayer.getweapon();

    //checks if the weapon hits tank directly
    changeDelta(victim);
    if((cx>=victim.getpx() && cx<=victim.getpx()+30 )&&(cy>=terrainY[victim.getpx()]-20 && cy<=terrainY[victim.getpx()])){
        curPlayer.setpoints(curPlayer.getpoints()+weapons[weapon][4]);
        return true;
    }
    return false;
}

function checkIndirectHit(cx,cy,radius,victim){
        //checks if the weapon hits within certain radius of the tank
    if((cx>=victim.getpx()-radius && cx<=victim.getpx()+30+radius )&&
        (cy>=terrainY[victim.getpx()]-20-radius && cy<=terrainY[victim.getpx()]+radius)){
        curPlayer.setpoints(curPlayer.getpoints()+weapons[weapon][4]/2);
    }
}

function drawSetup(curPlayer){
    ctx.fillStyle= "black";
    ctx.font="15px Georgia";
    ctx.fillText('Volley: '+volley, width/2-40, 20);

    ctx.font="20px Georgia";
    ctx.fillText("Player "+ curPlayer.getplayer() + "'s turn!", width/2-75, 40);
    ctx.fillText("Your current weapon is: "+ weapons[curPlayer.getweapon()][3] , width/2-135, 65);
    if(curPlayer.getplayer() == 1){
        ctx.fillText("Angle: " + (Math.floor((curPlayer.gettheta()*360/(2*Math.PI)))), width/2-165, 90);
        // drawPowerBar(curPlayer.getpower());
        // Angle(Math.floor((curPlayer.gettheta()*360*100/(2*180*Math.PI))));
    }
    else {
        ctx.fillText("Angle: " + (180-Math.floor((curPlayer.gettheta()*360/(2*Math.PI)))), width/2-165, 90);
    }
    ctx.fillText("Power: " + curPlayer.getpower(), width/2-55, 90);
    ctx.fillText("Moves: " + curPlayer.getmoves(), width/2+75, 90);
}

function drawPoints(tank1,tank2){
    var p1 = tank1.getpoints();
    var p2 = tank2.getpoints();
    
    ctx.fillStyle= "black";
    ctx.font="25px Georgia";
    ctx.fillText("Player 1:",width*.01,25);
    ctx.fillText("Player 2:",width*.91,25);
    ctx.fillText(p1,width*.015,47);
    ctx.fillText(p2,width*.915,47);
}

function checkEndGame(){
    if(volley>1){
        if(tank1.getpoints()>tank2.getpoints())
            endGame(tank2);
        else if(tank1.getpoints()<tank2.getpoints())
            endGame(tank1);
        else endGame();
    }
}

function redraw(){
    console.log("gasdzjk");
    ctx.restore();
    ctx.clearRect(0, 0, width, height);
    drawTerrain();
    drawTank(tank1);
    drawTank(tank2);
    if(gamePaused == true){drawPauseScreen();}
    drawSetup(curPlayer);
    drawPoints(tank1,tank2);
    checkEndGame();
}

var base = canvas.height*0.8;
var roughness =  randRange(2.7,3.2);
var iterations =  5;
var p;
var points =  [];//to store the mountains outer points

var  len =  points.length;
generate();

function getTerrainY(){
    var t = 0;
    var terrainY = [];
    for(var i =  1; i < len; i++){    
        var m = (points[i].y-points[i-1].y)/(points[i].x-points[i-1].x);
        t= 0;
        for(var j= points[i-1].x; j < points[i].x; ++j){
            temp= new point(Math.floor(j),Math.floor(points[i-1].y+m*(t++)));
            terrainY.push(temp.y);
        }
    }
    return terrainY;
}
var terrainY =  getTerrainY();


document.addEventListener('keydown', function(event) {
    //console.log(gamePaused,gamePlay,gameStarted,event.keyCode);
    if(gameStarted == true){
        ctx.restore();
        ctx.clearRect(0, 0, width, height);
        drawTerrain();
        if (event.keyCode == 38 && !gamePaused && gamePlay){
            rotateTurret(curPlayer,1);  //up rotates turret upwards
        }
        else if(event.keyCode == 40 && !gamePaused && gamePlay){
            rotateTurret(curPlayer,-1);       //down rotates turret downwards
        }
        else if(event.keyCode ==37 && !gamePaused && gamePlay){
            moveTank(curPlayer, -5);    //left moves tanks to the left
        }
        else if(event.keyCode == 39 && !gamePaused && gamePlay){
            moveTank(curPlayer, 5);    //right moves tank to the right
        }
        else if(event.keyCode == 65 && !gamePaused && gamePlay){
           
           if(curPlayer.getpower()>0)
            curPlayer.setpower(curPlayer.getpower()-1);
        }
        else if(event.keyCode == 68 && !gamePaused && gamePlay){
            if(curPlayer.getpower()<100){
                curPlayer.setpower(curPlayer.getpower()+1);
            }
        }
        else if(event.keyCode == 87 && !gamePaused && gamePlay){   //'w' changes the weapons
            curPlayer.changeWeapon();
        }
        else if(event.keyCode == 32 && !gamePaused && gamePlay){   //spacebar shoots!!
          
            launch(curPlayer);
        }
        else if(event.keyCode == 80){   //'p' Pauses the game
            pauseGame();
        }
        else if(event.keyCode == 82){   //'r' restarts the game
            if(gamePlay){
                ctx.drawImage(bg,0,0,width,height);
                generate();
                terrainY =  getTerrainY();
                startGame(); //if you want to play with same terrain
            //location.reload();
            }
        }
        redraw();
    }
    else {
        if(event.keyCode == 13 ){
            startGame();
        }
        else if(event.keyCode == 82){
            //gameStarted = true;
            ctx.drawImage(bg,0,0,width,height);
            generate();
            terrainY =  getTerrainY();
            startGame();
            // console.log(gameStarted);
        }
    }
},false);

startGame();
// console.log(gameStarted);