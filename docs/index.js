// let Store = require('electron-store')
// let store = new Store();
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
var topBarHeight = 100;
var scoreHeight = 500;
var cueHeight = 70;
var cueSpacing = 30;
var playheadOffset = 200;
var startingMeasure = 236;
var currentMeasure;
var currentPos = 0;
var currentTime = 0;
var initOffset = 0;
var amplitude = 0;
var ampFollow = false;
var paused = false;
var allowCreateCue = true;
var currentCueIndex = 0;
var oswald;
var osLogo;

// colors
var bgColor = 51;
var trackColor = 102
var playheadColor = 'rgba(0,212,144, 0.3)'
var measureColor = 'rgba(0,166,255,0.2)'
var lightCueColor = 'rgb(200,200,50)'
var videoCueColor = 'rgb(50,50,200)'
var soundCueColor = 'rgb(50,200,50)'


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
{num:270, x:0, startTime:82.55},
{num:271, x:0, startTime:87.55}
]
// store.set("measures", measures)

function preload(){
oswald = loadFont('fonts/Oswald-Light.ttf')
osLogo = loadImage('icons/openshow_logo_hamburger.png')
bars.push(loadImage('wozzeck/bars_eng/282_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/282_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/283_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/283_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/283_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/284_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/284_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/284_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/285_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/285_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/286_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/286_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/286_3.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/287_1.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/287_2.png')); // Load the image
bars.push(loadImage('wozzeck/bars_eng/287_2.png')); // Load the image
icons.push(loadImage('icons/lighting_1.png'))
icons.push(loadImage('icons/projector_2.png'))
icons.push(loadImage('icons/sound_2.png'))

}
function setup() {
createCanvas(windowWidth, windowHeight);
textFont(oswald);
// cnv.parent('canvas-holder')

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
  startPos+=bars[i].width/bars[i].height * scoreHeight
// measureNumb += bars[i].measures
}
for (var i = 0; i < measures.length-1; i++) {
  measures[i].duration = measures[i+1].startTime - measures[i].startTime
}
offsetX = measures[2].x * (bars[0].width/bars[0].height * scoreHeight)/bars[0].width - 20 - playheadOffset*2
initOffset = offsetX
console.log(offsetX)

//create amplitude following cue
//define in data string
//send constant stream of light cues with mapped amplitude baked into value
//stop sending when cue ends

// console.log("measures: "+ measureNumb)
//new Cue(cueName, timePosition, type, data (default=""), duration (default=3))
//light data format "/lightname dimmer r g b"
// if(store.has('cueList') && store.get('cueList').length > 0){
//   let cueList = store.get('cueList')
//   for (let index = 0; index < cueList.length; index++) {
//     createCueFromObject(cueList[index])
    
//   }
// }
// else {
  cues.push(new Cue("blackout", -2, "light", "/light1 0 0 0 0, /light2 0 0 0 0, /light3 0 0 0 0, /light4 0 255 255 255", 2))
  cues.push(new Cue("1", 1, "light", "/fade 0, /light1 0 0 0 0, /light2 10 255 0 0,  /light3 30 255 255 255, /light4 4 255 255 255"))
  cues.push(new Cue("2", 'm240', "light", "/fade 5, /light1 0 0 0 0, /light2 20 255 255 255,  /light3 30 255 255 255, /light4 4 255 255 255"))
  cues.push(new Cue("2.5 - Brighten", 'm242', "light", "/fade 5, /light1 0 0 0 0, /light2 20 255 255 255,  /light3 40 255 255 255, /light4 10 0 0 127",5))
  cues.push(new Cue("3", 'm249', "light", "/fade 0, /light1 4 255 255 255, /light2 0 255 255 0,  /light3 0 255 255 0, /light4 4 255 255 255"))
  // cues.push(new Cue("3", 31.2, "light", "/fade 0, /light1 4 255 255 255, /light2 0 255 255 0,  /light3 0 255 255 0, /light4 4 255 255 255"))
  cues.push(new Cue("3.5", 'm252', "light", "/fade 5, /light1 60 127 127 255, /light2 0 255 255 0,  /light3 0 255 255 0, /light4 4 255 255 255", 5))
  // cues.push(new Cue("setRed", 'm255', "light", "/fade 0, /light1 60 127 127 255, /light2 0 0 0 255,  /light3 10 255 0 0, /light4 4 0 0 255"))

  cues.push(new Cue("4", 'm255', "light", "/fade 5, /light1 0 255 255 255, /light2 0 0 0 255,  /light3 60 255 0 0, /light4 10 0 0 255"))
  
  // cues.push(new Cue("5", 'm259', "l", "/fade 3, /light1 20 255 255 255, /light2 0 0 0 0, /light3 0 0 0 0, /light4 10 255 255 0"))
  // cues.push(new Cue("6", 'm261', "light", "/fade 2, /light1 0 0 0 0, /light2 0 0 0 0, /light3 0 0 0 0, /light4 20 255 0 0"))
  cues.push(new Cue("set moon", 'm259', "light", "/fade 2, /light1 0 255 255 255, /light2 0 0 0 255,  /light3 60 255 0 0, /light4 8 255 255 255"))
  cues.push(new Cue("fade out", 'm260', "light", "/fade 10, /light1 0 0 0 0, /light2 0 0 0 0,  /light3 0 0 0 0, /light4 8 255 0 0"))
  cues.push(new Cue("bloody moon", 70, "video", "ampFollow", 12))
  cues.push(new Cue("black", 82, "light", "/fade 0, /light1 0 0 0 0, /light2 0 0 0 0, /light3 0 0 0 0, /light4 0 0 0 0", 0.25))
  // cues.push(new Cue("7.2", 55, "light", "/fade 4.5, /light1 0 0 0 0, /light2 2 255 255 0, /light3 68 0 0 255, /light4 10 255 255 255"))
  // cues.push(new Cue("curtain", 87, "light", "/fade 4.5, /light1 50 255 255 255, /light2 50 255 255 255, /light3 50 255 255 255, /light4 50 255 255 255"))
  // store.set('cueList', cues)
// }


}

function draw() {
// Displays the image at its actual size at point (0,0)
background(bgColor)
image(osLogo, 0, 10, osLogo.width/osLogo.height * topBarHeight * 0.8, topBarHeight * 0.8)
startPos = 0
var measureCounter = 0;
currentPos = offsetX + playheadOffset
currentTime = getTimeFromPos(playheadOffset)
if(currentTime > 82.5)
  goToMeasure(237)
// console.log(currentTime)
//draw opening
fill(measureColor)
noStroke()
strokeWeight(2)

//draw score
for (var i = 0; i < bars.length; i++) {

  image(bars[i], startPos - offsetX, 0 + topBarHeight, bars[i].width/bars[i].height * scoreHeight, scoreHeight)
  for (var j = 0; j < bars[i].measures; j++) {
    //draw measure markers
    rect(startPos - offsetX + (measures[measureCounter].x * (bars[i].width/bars[i].height * scoreHeight)/bars[i].width), topBarHeight, 15, scoreHeight, 6, 6, 6, 6)
    if(!measures[measureCounter].startPos){
      measures[measureCounter].startPos = startPos - offsetX + (measures[measureCounter].x * (bars[i].width/bars[i].height * scoreHeight)/bars[i].width)
      if(measures[measureCounter-1]){
          measures[measureCounter-1].width = measures[measureCounter].startPos - measures[measureCounter-1].startPos
          measures[measureCounter-1].speed = measures[measureCounter-1].width  / measures[measureCounter-1].duration/60  
      
    }

  }
  if(measures[measureCounter-1] && playheadOffset + offsetX-initOffset >= measures[measureCounter-1].startPos && offsetX-initOffset < measures[measureCounter].startPos){
    currentMeasure = measures[measureCounter-1]
    if(!$('#current-measure').is(':focus'))
      $('#current-measure').val(currentMeasure['num'])
    // if(offsetX > 7500)
      // goToMeasure(238)
    if(currentMeasure['num'] == 237){
     
    }
  }
    measureCounter++
  }
  startPos+=bars[i].width/bars[i].height * scoreHeight
}


updateFromPackets = true;

// console.log(currentMeasure)
// console.log(currentMeasure.speed)
if(newPos && Math.abs(newPos-offsetX) > 2){
  offsetX = lerp(offsetX, newPos, 0.1)
} else{
  newPos = false;
  offsetX += currentMeasure.speed;
}

// image(bars[0], 0 - offsetX, 0, bars[0].width, 400, mouseX * 4, mouseY * 4, bars[0].width, 400)
stroke("black")
// line(0,500,width,500)

//this is where we draw cues
for (var i = 0; i < icons.length; i++) {
  fill(trackColor)
  noStroke()
  rect(icons[i].width * cueHeight/icons[i].height,topBarHeight+scoreHeight+cueSpacing + (cueHeight+cueSpacing) * i, width, cueHeight)
  // line(0,500 + cueHeight * (i+1),width,500 + cueHeight * (i+1))
}
for (var i = 0; i < cues.length; i++) {
  cues[i].show()
}
for (var i = 0; i < icons.length; i++) {
  fill(bgColor)
  stroke(bgColor)
  rect(0, topBarHeight+scoreHeight + cueSpacing + (cueHeight+cueSpacing) * i, icons[i].width * cueHeight/icons[i].height, cueHeight)
  image(icons[i], 0, topBarHeight+scoreHeight + cueSpacing + (cueHeight+cueSpacing) * i, icons[i].width * cueHeight/icons[i].height, cueHeight)
}

//draw playhead
fill(playheadColor)
noStroke()
rect(playheadOffset,topBarHeight,25,scoreHeight + (cueHeight+cueSpacing) * icons.length)
// amp = map(mouseX, 0, width, 0, 1)
// console.log(amplitude)
// drawAmpMeter(amplitude, 0, topBarHeight+scoreHeight + icons.length*(cueSpacing+cueHeight) + cueSpacing)
if(ampFollow){
  let redValue = map(amplitude, 0, 1, 8, 100)
  sendToClient("/fade 0.1, /light4 "+redValue+" 255 0 0")
}

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
  var cueFound = false;
  if(mouseY > (topBarHeight + scoreHeight) && mouseY < (topBarHeight+scoreHeight + (cueHeight + cueSpacing)*icons.length) && allowCreateCue){
    for (let i = 0; i < cues.length; i++) {
      if(cues[i].hasMouse()){
        currentCueIndex = i;
        cues[i].edit()
        cueFound = true
      } 
    }
    if(!cueFound)
      createCue(getTimeFromPos(mouseX))
  }
}
function clearCues(){
  // store.set('cueList', [])
  location.reload()
}

function removeCueByName(name){
  for (let i = 0; i < cues.length; i++) {
    if(cues[i].name == name){
      cues.splice(i,1)
    }
    
  }
  store.set('cueList', cues)
}
function createCue(time){
  allowCreateCue = false;
  paused = false;
  togglePause();
  $('#delete-cue').hide()
  $('#add-cue-popup').css({top:mouseY-400, left:mouseX-100}).fadeIn()
  $('#cue-measure').val(getMeasureFromTime(time)['num'])
  $('#cue-time').val(time)
  $('#submit-cue').off('click')
  $('#submit-cue').on('click', addCue)
}
function clearForm(){
  $('#cue-name').val('')
  $('#cue-data').val('')
  $('#cue-duration').val('0.5')
}

function addCue(){
  cues.push(new Cue($('#cue-name').val(), parseFloat($('#cue-time').val()), $('#cue-type').val(), $('#cue-data').val(), parseFloat($('#cue-duration').val())))
  // store.set('cueList', cues)

  $('#add-cue-popup').fadeOut(function(){allowCreateCue = true; clearForm()})
  draw()
}
function updateCue(){
  cues[currentCueIndex].updateFromObj({
    name: $('#cue-name').val(), 
    startTime:parseFloat($('#cue-time').val()),
    type: $('#cue-type').val(),
    data: $('#cue-data').val(),
    duration: parseFloat($('#cue-duration').val())
  })
  // store.set('cueList', cues)
  $('#add-cue-popup').fadeOut(function(){allowCreateCue = true; clearForm()})
  draw()
}
function deleteCue(){
  if(confirm("Are you sure you want to delete this cue?"))
    cues.splice(currentCueIndex, 1)
  cancelCue()
  draw()
}
function cancelCue(){
  $('#add-cue-popup').fadeOut(function(){allowCreateCue = true;clearForm()})
}
function createCueFromObject(obj){
  cues.push(new Cue(obj['name'], obj['startTime'], obj['type'], obj['data'], obj['duration']))
}
function mouseMoved(){
  // topBarHeight = mouseY/2
  // cueSpacing = mouseY/ 10
  // bgColor = map(mouseX, 0, width, 0, 255)
  // trackColor = map(mouseY, 0, width, 0, 255)
}
function updateTime(t){
  newPos = getPosFromTime(t) - playheadOffset
}
function updateTimeFromPacket(t){
  if($('.switch input').is(':checked')){
    if(lastPacketTime == t)
      noLoop()
    else {
      loop()
    }
    lastPacketTime = t;
    clearTimeout(packetTimer)
    updateTime(t)
  }
// packetTimer = setTimeout(function(){noLoop()},1000)
}
function goToMeasure(measureNum){
  if(measureNum == 237){
      for (let i = 0; i < cues.length; i++) {
        cues[i].hasFired = false
      }
    }
  for (let i = 0; i < measures.length; i++) {
    if(measures[i]['num'] == parseInt(measureNum)){
      if(paused){
        offsetX = getPosFromTime(measures[i]['startTime']) - playheadOffset
        draw()
      }
      else
        offsetX = getPosFromTime(measures[i]['startTime']) - playheadOffset

      break;
    };
    
  }
}
function togglePause(){
  if(!paused){
    noLoop()
  } else {
    loop()
  }
  paused = !paused;
}
function play(){
  paused = false;
  loop()
}
function pause(){
  paused = true;
  noLoop();
}
function getPosFromTime(t){
  for (var i = 0; i < measures.length-1; i++) {
    if(t >= measures[i].startTime && t < measures[i+1].startTime){
        
        return measures[i].startPos + initOffset  + (t - measures[i].startTime)/measures[i].duration * measures[i].width
        // return measures[i].startPos + (t - measures[i].startTime)/measures[i].duration * measures[i].width
    }
  }
}
function getMeasureFromTime(t){
  for (var i = 0; i < measures.length-1; i++) {
    if(t >= measures[i].startTime && t < measures[i+1].startTime){
        return measures[i]
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

function onEnter(e){
  if(e.key == "Enter"){
    goToMeasure($('#current-measure').val())
  }
}

function keyTyped(){
  if(allowCreateCue && !$('input').is(':focus')){
    if(key == " ")
      togglePause()
  }
}


// web only functions
function sendToClient(msg){
  console.log("Sending out: "+ msg)
}
