let Store = require('electron-store')
let store = new Store();
let bars = []; // Declare variable 'img'.
let cues = [];
var offsetX = 0;
var receivingPackets = false;
var updateFromPackets = false;
var packetTimer;
var lastPacketTime = 0;
var newPos = false;
var startPos = 0;
var icons = [];
var cueHeight = 50;
var startingMeasure = 236;
var currentMeasure;
var initOffset = 0;
var amplitude = 0;
var measures = [
{num:236, x:0, startTime:-5},
{num:237, x:589, startTime:-2},
{num:238, x:1459, startTime:0.11},
{num:239, x:0, startTime:3.90},
{num:240, x:807, startTime:6.66},
{num:241, x:1519, startTime:9.12},
{num:242, x:0, startTime:11.60},
{num:243, x:1135, startTime:14.20},
{num:244, x:0, startTime:16.90},
{num:245, x:1094, startTime:19.97},
{num:246, x:0, startTime:21.90},
{num:247, x:1016, startTime:24.80},
{num:248, x:0, startTime:26.96},
{num:249, x:1079, startTime:29.30},
{num:250, x:0, startTime:31.99},
{num:251, x:898, startTime:34.60},
{num:252, x:0, startTime:39.30},
{num:253, x:921, startTime:42.09},
{num:254, x:1486, startTime:44.74},
{num:255, x:0, startTime:47.30},
{num:256, x:986, startTime:49.24},
{num:257, x:0, startTime:51.32},
{num:258, x:1138, startTime:53.62},
{num:259, x:0, startTime:56.17},
{num:260, x:1142, startTime:59.24},
{num:261, x:0, startTime:61.79},
{num:262, x:778, startTime:63.89},
{num:263, x:1467, startTime:66.13},
{num:264, x:0, startTime:68.04},
{num:265, x:536, startTime:69.11},
{num:266, x:1073, startTime:71.27},
{num:267, x:1556, startTime:73.95},
{num:268, x:0, startTime:76.55},
{num:269, x:1069, startTime:79.49},
{num:270, x:0, startTime:82.55, duration: 3}
]
store.set("measures", measures)

function preload(){
bars.push(loadImage('wozzeck/bars/282_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars/282_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars/283_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars/283_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars/283_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars/284_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars/284_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars/284_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars/285_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars/285_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars/286_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars/286_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars/286_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars/287_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars/287_2.png')); // Load the image
icons.push(loadImage('icons/lighting.png'))
icons.push(loadImage('icons/projector.png'))
icons.push(loadImage('icons/sound.png'))
}
function setup() {
createCanvas(windowWidth, windowHeight);
console.log(measures.length)
bars[0].measures = 3;  
bars[1].measures = 3;  
bars[2].measures = 2;  
bars[3].measures = 2;  
bars[4].measures = 2;  
bars[5].measures = 2;  
bars[6].measures = 2;  
bars[7].measures = 3;  
bars[8].measures = 2;  
bars[9].measures = 2;  
bars[10].measures = 2;  
bars[11].measures = 3;  
bars[12].measures = 4;  
bars[13].measures = 2;  
bars[14].measures = 1;  

// var measureNumb = 0
for (var i = 0; i < bars.length; i++) {
  bars[i].startPos = startPos
  startPos+=bars[i].width/bars[i].height * 500
// measureNumb += bars[i].measures
}
for (var i = 0; i < measures.length-1; i++) {
  measures[i].duration = measures[i+1].startTime - measures[i].startTime
}
offsetX = measures[2].x * (bars[0].width/bars[0].height * 500)/bars[0].width - 20
initOffset = offsetX
console.log(offsetX)
// console.log("measures: "+ measureNumb)
//new Cue(cueName, timePosition, type, data (default=""), duration (default=3))
//light data format "/lightname dimmer r g b"
cues.push(new Cue("0", 0, "light", "/light1 0 0 0 0, /light2 0 0 0 0, /light3 0 0 0 0, /light4 0 0 0 0"))
cues.push(new Cue("1", 'm242', "light", "/fade 4.5, /light1 0 0 0 0, /light2 0 0 0 0, /light3 20 255 255 255, /light4 0 0 0 0"))
cues.push(new Cue("2", 'm243', "light", "/light1 255 0 0 255, /light2 100 200 250 0, /light3 0 0 0 0, /light4 0 0 0 0"))
cues.push(new Cue("3", 'm244', "light", "/fade 3.2, /light1 255 255 255 255, /light2 100 200 250 0, /light3 255 0 0 255, /light4 0 0 0 0"))
cues.push(new Cue("4", 18.2, "vid"))
cues.push(new Cue("5", 25, "vid"))
cues.push(new Cue("6", 31, "l", "/light1 6 34 242 1, /light2 255 200 250 0, /light3 0 0 0 0, /light4 0 0 0 0"))
cues.push(new Cue("7", 31.5, "s"))
cues.push(new Cue("8", 46.5, "light", "/light3 255 255 255 0"))
cues.push(new Cue("9", 55, "light", "/light1 9 100 200 200, /light2 255 200 250 0, /light3 0 0 0 0, /light4 0 0 0 0"))
cues.push(new Cue("10", 67, "light", "/light1 10 100 200 200, /light2 100 200 250 0, /light3 0 0 0 0, /light4 0 0 0 0"))
cues.push(new Cue("11", 71, "light", "/light1 11 255 255 0, /light2 100 200 250 0, /light3 255 0 0 255, /light4 0 0 0 0"))

}

function draw() {
// Displays the image at its actual size at point (0,0)
background(255)
startPos = 0
var measureCounter = 0;
//draw opening
fill('rgba(255,0,0,0.3)')
noStroke()
strokeWeight(2)
for (var i = 0; i < bars.length; i++) {

image(bars[i], startPos - offsetX, 0, bars[i].width/bars[i].height * 500, 500)
for (var j = 0; j < bars[i].measures; j++) {
  rect(startPos - offsetX + (measures[measureCounter].x * (bars[i].width/bars[i].height * 500)/bars[i].width), 0, 15, 500)
  if(!measures[measureCounter].startPos){
    measures[measureCounter].startPos = startPos - offsetX + (measures[measureCounter].x * (bars[i].width/bars[i].height * 500)/bars[i].width)
    // console.log(measures[measureCounter].startPos)
    if(measures[measureCounter-1]){
        measures[measureCounter-1].width = measures[measureCounter].startPos - measures[measureCounter-1].startPos
        measures[measureCounter-1].speed = measures[measureCounter-1].width  / measures[measureCounter-1].duration/60  
    // console.log(measures[measureCounter-1].startPos)
    
  }

}
if(measures[measureCounter-1] && offsetX >= measures[measureCounter-1].startPos && offsetX < measures[measureCounter].startPos){currentMeasure = measures[measureCounter-1]}
measureCounter++
}
startPos+=bars[i].width/bars[i].height * 500
}
rect(0,0,25,500)

updateFromPackets = true;

// console.log(currentMeasure)
// console.log(currentMeasure.speed)
if(newPos && Math.abs(newPos-offsetX) > 2){
  offsetX = lerp(offsetX, newPos, 0.1)
} else{
  newPos = false;
  offsetX += currentMeasure.speed;
}
for (var i = 0; i < cues.length; i++) {
  cues[i].show()
}
// image(bars[0], 0 - offsetX, 0, bars[0].width, 400, mouseX * 4, mouseY * 4, bars[0].width, 400)
stroke("black")
line(0,500,width,500)
for (var i = 0; i < icons.length; i++) {
image(icons[i], 0, 500 + cueHeight * i, cueHeight, cueHeight)
line(0,500 + cueHeight * (i+1),width,500 + cueHeight * (i+1))
}

// amp = map(mouseX, 0, width, 0, 1)
console.log(amplitude)
drawAmpMeter(amplitude, 0, 655)
// fill(255,0,0)
// ellipse(100,250 + sin(offsetX/10)*50, 50,50)
// console.log(offsetX)
// var str = mouseX*4 + " " + mouseY*4
// text(str, 0,450)
// offsetX += mouseX /100
// console.log(startPos - offsetX)
}
function drawAmpMeter(rms, posMeterX, posMeterY){
stroke(0, 0, 0);
strokeWeight(2);
fill(255);
rect(2 + posMeterX, 2 + posMeterY, 50, 167, 3);
// Draw an ellipse with size based on volume
stroke(205, 204, 0);
strokeWeight(4);
line(10 + posMeterX, 165 - (500 * rms) + posMeterY , 40 + posMeterX, 165 - (500 * rms) + posMeterY) ;

}
function mouseClicked(){
  console.log(getTimeFromPos(mouseX))
}
function updateTime(t){
  if(lastPacketTime == t)
    noLoop()
  else {
    loop()
  }
  lastPacketTime = t;
  clearTimeout(packetTimer)
  newPos = getPosFromTime(t)
// packetTimer = setTimeout(function(){noLoop()},1000)
}
function getPosFromTime(t){
  for (var i = 0; i < measures.length-1; i++) {
    if(t >= measures[i].startTime && t < measures[i+1].startTime){
        console.log(measures[i].startPos + initOffset + (t - measures[i].startTime)/measures[i].duration * measures[i].width)
        
        return measures[i].startPos + initOffset + (t - measures[i].startTime)/measures[i].duration * measures[i].width
        // return measures[i].startPos + (t - measures[i].startTime)/measures[i].duration * measures[i].width
    }
  }
}
function getTimeFromPos(pos){
  //pos = screeenPos + offsetX
  pos = pos + offsetX
  //loop through measures until startPos is greater than
  for (var i = 0; i < measures.length-1; i++) {
    if(pos >= measures[i].startPos && pos < measures[i+1].startPos){
        return (measures[i].duration * (pos - measures[i].startPos - initOffset))/measures[i].width + measures[i].startTime
        // return measures[i].startPos + (t - measures[i].startTime)/measures[i].duration * measures[i].width
    }
  }
}
function keyTyped(){
if(key == "1")
updateTime(97.4)
if(key == "2")
offsetX = bars[1].startPos
if(key == "3")
offsetX = bars[2].startPos
if(key == "4")
offsetX = bars[3].startPos
if(key == "5")
offsetX = bars[4].startPos
if(key == "6")
offsetX = bars[5].startPos
if(key == "7")
offsetX = bars[6].startPos
if(key == "8")
offsetX = bars[7].startPos
if(key == "9")
offsetX = bars[8].startPos
}
class Cue {
constructor(name, startTime, type, data="", duration=3){
this.name = name
if(typeof startTime == "string" && startTime.indexOf("m") == 0){
  let measure = parseInt(startTime.slice(1))
  console.log(measure)
  for (let index = 0; index < measures.length; index++) {
    if(measures[index]['num'] == measure){
      console.log(measures[index]['startTime'])
      this.startTime = measures[index]['startTime']
      console.log(this.startTime)
      break
    }
  }
}
else {
  this.startTime = startTime
}
// this.startTime = startTime
this.duration = duration
this.data = data
this.type = type;
this.height = cueHeight;
this.startY = 500
this.hasFired = false
switch(this.type){
  case "light": 
  case "l":
      this.type = "light"
      this.y = this.startY;
      this.color = color(200,200,50);
      break
  case "vid": 
  case "video": 
  case "v":
  case "viz":
      this.type = "video"
      this.y = this.startY + this.height;
      this.color = color(50,50,200);
      break
  case "sound": 
  case "s":
      this.type = "sound"
      this.y = this.startY + this.height*2;
      this.color = color(50,200,50);
      break
} 
}

show() {
  if(!this.startPos){this.startPos = getPosFromTime(this.startTime);}
  fill(this.color)
  rect(this.startPos - offsetX, this.y, this.duration * 30, this.height)
  textSize(18)
  stroke(0)
  fill(0)
  text(this.name, this.startPos - offsetX + 10, this.y+10, this.duration * 30 - 20, this.height-20)
  if(this.startPos - offsetX < 10 && !this.hasFired){
    let msg;
    if(this.data)
      msg = this.data
    else
      msg = this.type + " " + this.name
    sendToClient(msg)
    this.hasFired = true
  }
}

}