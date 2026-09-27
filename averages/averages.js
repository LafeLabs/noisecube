
averages = {};

load_file('averaged_traces.json').then(
    raw_data => {
        averages = JSON.parse(raw_data);
    }
);





function setup() {

    let container = document.getElementById('p5-canvas-container');
    let squareSize = Math.min(windowWidth, windowHeight) - 50;
    let canvas = createCanvas(squareSize, squareSize);
    canvas.parent('p5-canvas-container');
    frameRate(10);
}

traceIndex = 0;
delta = 1;

function draw(){
    background(159,135,103);
    stroke(0);
    fill(0);
    strokeWeight(10);
    for(let index = 0;index < averages.averages.length;index++){
        point(map(index,0,averages.averages.length,0,width),map(averages.averages[traceIndex][index],0,1000,height,0));
    }
    traceIndex += delta;
    if(traceIndex == averages.averages.length-1){
        delta = -delta;
    }
    if(traceIndex < 0){
        delta = -delta;
        traceIndex=0;
    }
}

function load_file(name) {
    return fetch('load-file.php?filename=' + name).then(res => res.text());
}


