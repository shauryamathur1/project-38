var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroom,garden,  washroom
var gameState

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
BedRoom=loadImage("virtual pet images/Bed Room.png")
Garden=loadImage("virtual pet images/garden.png");
washroom=loadImage("virtual pet images/Wash Room.png")
}

function setup() {
  database=firebase.database();
  // read gameState from database 
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val()  
  })
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
writeStroke(foodS);

if(foodS==0){
  dog.addImage(happyDog)
  milkBottle2.visible=false;
}else{
  dog.addImage(sadDog);
  milkBottle2.visible=true;
}
  if(gameState==1){
    Dog.addImage(happyDog);
    dog.scale=0.175;
    Dog.y=250;
  }
    if(gameState==2){
      Dog.addImage(sadDog);
      dog.scale=0.175;
      milkBottle2.visible=false;
      Dog.y=250;

      var Bath=createButton("I want to take bath");
      Bath.position(580,125);
    if(Bath.mousePressed(function(){
      gameState=3;
      database.ref('/').update({'gameState':gameState})
    }));

    var sleep=createButton("I am very sleepy");
    sleep.poition(710,125);
    if(sleep.mousePressed(function(){
    gameState=4;
    database.ref('/').update({'gameState':gameState})  
  }))

  var playGarden=createButton("Lets play in the park");
  PlayInGarden.position(585,160);
  if(playInGarden.mousePressed(function(){
    gameState=6;
    database.ref('/').update({'gameState':gameState});
  }))
  if(gameState===6){
    dog.y=175;
    dog.addImage(garden);
    dog.scale=1;
    milkBottle2.visiblee=false;
  }

  if(gameState==4){
    Dog.addImage(bedroom);
    dog.scale=1;
    milkBottle2.visible=false;
  }
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

   if(gameState!="hungry"){
     feed.hide();
    addFood.hide();
    dog.remove();
   }
   else{
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
   }

   currentTime=hour();
   if(currentTime==(lastFed+1)){
  update("playing");
  foodObj.garden(); 
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();  
  }else if (currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry")
    foodObj.display
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state

  })
}}
function readStock(data)
{
  foodS=data.val();
}
function writeStock(x){
  database.ref('/').update({
    food:x
  })
}