const debug_mode = false;//set to false to send data over socket
let socket = null;
if (!debug_mode) {
  socket = new WebSocket('ws://localhost:6502');//this talks to instrument.py, while port 8086 talks to dirt.py
}

controlIndex = 0;

noisecube = {};

noisecube.controls = [{
    "knob_mode":"qubit_flux_bias",
    "knobs":[[0,0,0],[0,0,0],[0,0,0]],
    "quantities":["dc_offset","ac_vpp","ac_frequency"],
    "units":["V","V","Hz"],
    "multipliers":[[0.1,0.01,0.001],[0.1,0.01,0.001],[100,10,1]],
    "max":[1,1,5000],
    "min":[-1,-1,100],
    "defaults":[0,0,440],
    "values":[0,0,440]
},{
    "knob_mode":"noise_source_bias",
    "knobs":[[0,0,0],[0,0,0],[0,0,0]],
    "quantities":["dc_offset","ac_vpp","ac_frequency"],
    "units":["V","V","Hz"],
    "multipliers":[[0.1,0.01,0.001],[0.1,0.01,0.001],[100,10,1]],
    "max":[1,1,5000],
    "min":[-1,-1,100],
    "defaults":[0,0,440],
    "values":[0,0,440]
},{
    "knob_mode":"radio_pump",
    "knobs":[[0,0,0],[0,0,0]],
    "quantities":["power","frequency"],
    "units":["dBm","GHz"],
    "multipliers":[[0.1,0.01,0.001],[0.1,0.01,0.001]],
    "max":[0,9],
    "min":[-40,4],
    "defaults":[-26,6],
    "values":[-26,6]
},{
    "knob_mode":"radio_probe",
    "knobs":[[0,0,0],[0,0,0],[0,0,0]],
    "quantities":["power","frequency","programmable_attenuator"],
    "units":["dBm","GHz","dB"],
    "multipliers":[[0.1,0.01,0.001],[0.1,0.01,0.001],[10,1,0.1]],
    "max":[0,9,0],
    "min":[-60,4,-63],
    "defaults":[-26,5.5,30],
    "values":[-26,5.5,30]
},{
    "knob_mode":"radio_spectrum",
    "knobs":[[0,0,0],[0,0,0]],
    "quantities":["center_frequency","frequency_range"],
    "units":["GHz","GHz"],
    "multipliers":[[0.1,0.01,0.001],[0.1,0.01,0.001]],
    "max":[9,4],
    "min":[4,0],
    "defaults":[5.5,0.1],
    "values":[5.5,0.1]
},{
    "knob_mode":"am_radio_spectrum",
    "knobs":[[0,0,0]],
    "quantities":["demodulation_frequency"],
    "units":["GHz"],
    "multipliers":[[0.1,0.01,0.001]],
    "max":[9],
    "min":[4],
    "defaults":[5.5],
    "values":[5.5]
}];

noisecube.spectra = [];
noisecube.knob_history = [];
noisecube.fghz = [];
noisecube.audio_frequency = [];

save_file("noisecube.json",JSON.stringify(noisecube,null,"    "));

knobIndex = -1;//always -1 when mouse not in knob
buttonIndex = -1;//always -1 when mouse not in button

knobClicks = 24;

canvas_width = innerWidth - 30;
canvas_height = innerHeight - 30;

square_width = canvas_width/2;
knob_diameter = 0.5*square_width/3;
knob_radius = knob_diameter/2;
knob_origin_x = square_width/6;
knob_origin_y = square_width/6;
knob_spacing_x = square_width/3;
knob_spacing_y = square_width/3;

footer_height = innerHeight - square_width;

button_width = 0.94*square_width/3;
button_height = 0.8*footer_height/3;
button_origin_x =  square_width/6;
button_origin_y =  square_width + footer_height/3;
button_spacing_x = square_width/3;
button_spacing_y = footer_height/3;



function setup() {

    let container = document.getElementById('p5-canvas-container');
    let canvas = createCanvas(canvas_width,canvas_height);
    canvas.parent('p5-canvas-container');
    
}

function draw() {

    clear();
    stroke(0);
    strokeWeight(1);
    line(width/2,0,width/2,height);
    knobIndex = -1;//always -1 when mouse not in knob
    strokeWeight(1);
    fill(0);
    textSize(20);
    text(noisecube.controls[controlIndex].knob_mode,5,25);
    
    for(row = 0; row < noisecube.controls[controlIndex].knobs.length; row++){
        noisecube.controls[controlIndex].values[row] = noisecube.controls[controlIndex].defaults[row]
        noisecube.controls[controlIndex].values[row] += noisecube.controls[controlIndex].multipliers[row][0]*noisecube.controls[controlIndex].knobs[row][0];
        noisecube.controls[controlIndex].values[row] += noisecube.controls[controlIndex].multipliers[row][1]*noisecube.controls[controlIndex].knobs[row][1];
        noisecube.controls[controlIndex].values[row] += noisecube.controls[controlIndex].multipliers[row][2]*noisecube.controls[controlIndex].knobs[row][2];
        noisecube.controls[controlIndex].values[row] = Math.round(noisecube.controls[controlIndex].values[row]*1000)/1000;
        
        if(noisecube.controls[controlIndex].values[row] > noisecube.controls[controlIndex].max[row]){
            noisecube.controls[controlIndex].values[row] = noisecube.controls[controlIndex].max[row];
        }
        if(noisecube.controls[controlIndex].values[row] < noisecube.controls[controlIndex].min[row]){
            noisecube.controls[controlIndex].values[row] = noisecube.controls[controlIndex].min[row];
        }        
        strokeWeight(1);
        fill(0);
        text(noisecube.controls[controlIndex].quantities[row] + " = " + noisecube.controls[controlIndex].values[row] + " " + noisecube.controls[controlIndex].units[row],5,knob_origin_y + knob_spacing_y*row - 10 - knob_radius);
        
        for(col = 0; col < 3; col++){
            knob_x = knob_origin_x + col*knob_spacing_x;
            knob_y = knob_origin_y + row*knob_spacing_y;
            strokeWeight(1);
            fill(0);
            text(noisecube.controls[controlIndex].knobs[row][col]+"x"+noisecube.controls[controlIndex].multipliers[row][col],knob_x - 10,knob_y + knob_radius + 25);
            strokeWeight(5);
            fill(255);
    
            knob_distance = Math.sqrt( (knob_x - mouseX)**2  + (knob_y - mouseY)**2);
            if(knob_distance < knob_radius){
                fill("#00ff0080");
                knobIndex = 3*row + col;
                if (mouseIsPressed === true) {
                    //fill("green");
                }

            }
            else{
                fill(255);
            }
            circle(knob_x,knob_y,knob_diameter);
            line(knob_x,knob_y,knob_x + knob_radius*Math.sin(2*Math.PI*noisecube.controls[controlIndex].knobs[row][col]/knobClicks), knob_y - knob_radius*Math.cos(2*Math.PI*noisecube.controls[controlIndex].knobs[row][col]/knobClicks));
            
//            line(knobs[rowIndex][columnIndex].x,knobs[rowIndex][columnIndex].y,knobs[rowIndex][columnIndex].x + knob_radius*Math.sin(2*Math.PI*qnr.knobs[rowIndex][columnIndex]/knobClicks),knobs[rowIndex][columnIndex].y - knob_radius*Math.cos(2*Math.PI*qnr.knobs[rowIndex][columnIndex]/knobClicks));

//

        }
    }

    strokeWeight(5);
    buttonIndex = -1;//always -1 when mouse not in button
    fill(255);
    for(row = 0; row < 2; row++){
        for(col = 0; col < 3; col++){
            button_x = button_origin_x + col*button_spacing_x;
            button_y = button_origin_y + row*button_spacing_y;
            if(Math.abs(mouseX - button_x) < 0.5*button_width && Math.abs(mouseY - button_y) < 0.5*button_height){
                fill("#00ff0080");
                if (mouseIsPressed === true) {
                    fill("green");
                }

                buttonIndex = 3*row + col;
        
            }
            else{
                fill(255);
            }
            strokeWeight(5);
            rect(button_x - 0.5*button_width,button_y - 0.5*button_height,button_width,button_height);
            strokeWeight(1);
            fill(0);
            
            //noisecube.controls
            
            text(noisecube.controls[3*row + col].knob_mode,button_x - 0.5*button_width + 5,button_y+7);
        }
    }
    
}

function mouseWheel(event) {
    if(knobIndex >= 0){
        if(event.delta < 0){ 
            noisecube.controls[controlIndex].knobs[Math.floor(knobIndex/3)][knobIndex%3]++;
            
        }
        else{
            noisecube.controls[controlIndex].knobs[Math.floor(knobIndex/3)][knobIndex%3]--;
        }
        
        knobPayload = {};
        
        knobPayload.quantity = noisecube.controls[controlIndex].quantities[Math.floor(knobIndex/3)];
        knobPayload.unit = noisecube.controls[controlIndex].units[Math.floor(knobIndex/3)];
        knobPayload.knob_mode = noisecube.controls[controlIndex].knob_mode;
        
        let knobRow = Math.floor(knobIndex/3);

        noisecube.controls[controlIndex].values[knobRow] = noisecube.controls[controlIndex].defaults[knobRow]
        noisecube.controls[controlIndex].values[knobRow] += noisecube.controls[controlIndex].multipliers[knobRow][0]*noisecube.controls[controlIndex].knobs[knobRow][0];
        noisecube.controls[controlIndex].values[knobRow] += noisecube.controls[controlIndex].multipliers[knobRow][1]*noisecube.controls[controlIndex].knobs[knobRow][1];
        noisecube.controls[controlIndex].values[knobRow] += noisecube.controls[controlIndex].multipliers[knobRow][2]*noisecube.controls[controlIndex].knobs[knobRow][2];
        noisecube.controls[controlIndex].values[knobRow] = Math.round(noisecube.controls[controlIndex].values[knobRow]*1000)/1000;
        
        if(noisecube.controls[controlIndex].values[knobRow] > noisecube.controls[controlIndex].max[knobRow]){
            noisecube.controls[controlIndex].values[knobRow] = noisecube.controls[controlIndex].max[knobRow];
        }
        if(noisecube.controls[controlIndex].values[knobRow] < noisecube.controls[controlIndex].min[knobRow]){
            noisecube.controls[controlIndex].values[knobRow] = noisecube.controls[controlIndex].min[knobRow];
        }        

        knobPayload.value = noisecube.controls[controlIndex].values[knobRow];
        knobPayload.timestamp = Date.now();
        
        sendData(knobPayload);
        
    }


}

 

function sendData(instrumentData) {
  if (!debug_mode && socket) {
    socket.send(JSON.stringify(instrumentData));
  } else {
    console.log("Debug Mode (No Socket Connection):", instrumentData);
  }
}


function mouseClicked() {
  if ([0, 1, 2, 3, 4, 5].includes(buttonIndex)) {
    controlIndex = buttonIndex;
  }
}

