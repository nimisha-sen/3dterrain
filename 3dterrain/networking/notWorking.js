

/*An array. 
//A ‘While’ or ‘For’ Loop.  

 A conditional statement (<, >, ==, >=, <=).  

// A custom function (i.e. one you have written).  

// Use of p5.js’ random() and/or map().  

// Utilize the Weather API and make use of at least two live data values. 

// Incorporate a GUI element (i.e. button or a slider) OR make use of an event (i.e. keyboard, mouse - see p5js.org/reference). 


• Water height changes w.r.t to sea pressure in curr loc
• 

*/
let weatherjson
let isWeatherloaded = false;

const numBoxes = 30;
const sideLength = 10;

const minHeight = 1;
const maxHeight = 150;

const noiseOffset = 100;
const noiseScale = 0.001;
const timeScale = 0.0002;
const rotateScale = 0.0001;

let seaLevel = 0.4;
const rockLevel = 0.25;
const sandLevel = 0.5;
 const treeLevel = 0.75;

const rockColour = "#62718E";
const sandColour = "#D4A463";
const grassColour = "#6a994e";
const forestColour = "#6D973E";
const seaColour = "#1098A688";
const seaColourSolid = "#1098A6";
 const trunkColour = "#886622";
 const leafColour = "#468343";

let cam;

let heightScale = 1;
let heightDir = 0.05;

function setup(){
  createCanvas(500, 500, WEBGL); //whats WEBGL
  
  //calculate camera position
  cam = createCamera();
  const camHeight = -numBoxes * sideLength * 0.8;
  const orbitRad = numBoxes * sideLength * 1.2;  
  cam.setPosition(0, camHeight, orbitRad);
  cam.lookAt(0, 0, 0);

  noStroke();

  // Fetch JSON
 // fetchWeatherDataInInterval(10000);

}


// Core Draw
function draw() {
  background(245);


  if(isWeatherloaded === false) {
    //text(`Invalid JSON!`, 250,250);
    return;
  }

  const t = millis();
  
  // Update heightScale
  heightScale = constrain(heightScale + heightDir, 0, 1);
  
  // Update rotational view
  //rotateY(-t * rotateScale);
  


  // Weather Related tasks
  //let pressureUnit = weatherjson.hourly_units.pressure_msl;


  // Configure GUI Text:
  // let x = 10;
  // let y = 30;
 // textAlign(LEFT);
  ////text(`Interval Duration:`, x,y);
 // text(`Pressure Unit: ${pressureUnit}`, x,y + 15);
 // text(`Date: ${x}`,x , y + 25);


  // Do some lighting
  ambientLight(100, 100, 100);
  directionalLight(200, 200, 200, -1, 0.75, -1);
  
  drawTerrain(t);
}

function keyReleased() {
  // Flip height animation direction
  if(key === "h") {
    heightDir *= -1;
  }
}

function drawTerrain(t) {
  for(let i = 0; i < numBoxes; i ++) {
    for(let j = 0; j < numBoxes; j ++) {
      const x = (i * sideLength) - (numBoxes * sideLength)/2;
      const z = (j * sideLength) - (numBoxes * sideLength)/2;

      drawBox(x, z, t);
    }
  }
  
  // Only draw sea if we're NOT in 2D mode
  if(heightScale != 0) {
    push();
    const waterHeight = getBoxHeight(seaLevel);
    
    // Make the water slightly less than the full width
    // to prevent clipping/flickering
    const waterSize = numBoxes * sideLength - 0.1;
    fill(seaColour);
    
    // Change Water height here
    translate(-sideLength/2, -waterHeight/2, -sideLength/2);
    box(waterSize, getBoxHeight(seaLevel), waterSize);
    pop();
  }
}


function drawBox(x, z, t) {
  const noiseValue = getNoiseValue(x, z, t);
  let h = getBoxHeight(noiseValue);
  
  // Boxes don't like having 0 height
  // So if we're in 2D, make the height not 0
  // and draw some VERY flat boxes!
  h = max(h, 0.01);

  push();
  translate(x, -h/2, z);
  fill(getColour(noiseValue));
  
  box(sideLength, h, sideLength);
  
  // // Only draw trees if we're NOT in 2D mode
  if(noiseValue >= treeLevel && heightScale > 0) {
  drawTree(h);
  }
  
  pop();
}

function drawTree(h) {
  const trunkLength = 10;
  const leafLength = 10;
  
  push();
  
  translate(0, -h/2, 0);
  
  //trunk
  fill(trunkColour);
  translate(0, -trunkLength/2, 0);
  box(trunkLength/4, trunkLength, trunkLength/4);
  
  //leaves
  fill(leafColour);
  translate(0, -trunkLength/2 - leafLength/2, 0);
  box(leafLength * 3/4, leafLength, leafLength * 3/4);
  translate(0, -leafLength * 3/4, 0);
  box(leafLength/4);
  
  
  pop();
}

function getNoiseValue(x, z, time) {
  x = x * noiseScale + noiseOffset;
  z = z * noiseScale + noiseOffset;
  time = time * timeScale + noiseOffset;
  return noise(x, z, time);
}

function getBoxHeight(noiseValue) {
  return map(noiseValue, 0, 1, minHeight, maxHeight) * heightScale;
}

function getColour(noiseValue) {
  // If we're in 2D mode, use the sea level
  // In 3/4D mode, this gets drawn as a seperate box
  if(noiseValue < seaLevel && heightScale == 0) {
    return seaColour;
  }
  
  if(noiseValue < rockLevel) {
    return rockColour
  } else if(noiseValue < sandLevel) {
    return sandColour;
  } else {
    const lerpVal = map(noiseValue, sandLevel, treeLevel, 0, 1);
    return lerpColor(color(grassColour), color(forestColour), lerpVal);
  }
}


// Networking Logic:

// function fetchWeatherDataInInterval(interval) {
//   setInterval(fetchWeather, interval);
// }

// function fetchWeather(endpoint = "https://api.open-meteo.com/v1/forecast?latitude=-8.33&longitude=115.00&hourly=pressure_msl" ) {
//   // Function loads the data from the given endpoint and when 100% done calls the passed function 
//   loadJSON(endpoint, loadedweather );
// }

// // Called once the JSON is loaded 
// function loadedweather(json){
//   weatherjson = json; //variable defined at the top
//   isWeatherloaded = true;
// }