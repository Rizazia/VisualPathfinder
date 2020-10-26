'use strict';
import {dijkstra} from './Algorithms/Dijkstra.js';
import {aStar} from './Algorithms/AStar.js';
import {recursiveDivision} from './Algorithms/RecursiveDivision.js';

const COLLUMS = 41;
const ROWS = 31;
const SQUARE_WIDTH = 20;
const SQUARE_HEIGHT = 20;
const NODE_SPACING = 4;

const NODE_OPEN = "open";
const NODE_WALL = "wall";
const NODE_START = "start";
const NODE_GOAL = "goal";
const NODE_PATH = "path";
const NODE_VISITED = "visted";

var mouseIsDown = false;//used to monitor drag events on the canvas
var justSolved = false;
var controlsEnabled = true;

var canvas;
var canvasWidth;
var canvasHeight;
var ctx;
var nodes = [];
//initializes the nodes array with default values
let id = 0;
for (var c = 0; c < COLLUMS; c++){
    nodes[c] = [];
    for (var r = 0; r < ROWS; r++){
        nodes[c][r] = {id: id++, x: c*(SQUARE_WIDTH + NODE_SPACING), y: r*(SQUARE_HEIGHT + NODE_SPACING), state: NODE_OPEN, col:c, row:r};
    }
}

init();

function drawNode(node){
    setTimeout(function(){
        ctx.clearRect(node.x, node.y,SQUARE_WIDTH, SQUARE_HEIGHT);
        ctx.fillStyle = getNodeColor(node.state);

        ctx.beginPath();
        ctx.fillRect(node.x, node.y, SQUARE_WIDTH, SQUARE_HEIGHT);
        //+&- ctx.linewidth is to offset the stroke to be an inner stroke instead of the default outer stroke
        ctx.strokeRect(node.x + ctx.lineWidth, node.y + ctx.lineWidth, SQUARE_WIDTH - ctx.lineWidth, SQUARE_HEIGHT - ctx.lineWidth);
        ctx.closePath();
        ctx.fill();
    }, 1);
}

function canvasAction(){
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    
    //find which box is clicked
    for(let c = 0; c < COLLUMS; c++){
        //check if collum c was click
        if (mouseX >= nodes[c][0].x && mouseX <= nodes[c][0].x + SQUARE_WIDTH){
            for(let r = 0; r < ROWS; r++){
                //check if row r was clicked, finding the clicked square
                if (mouseY >= nodes[0][r].y && mouseY <= nodes[0][r].y + SQUARE_WIDTH){
                    //find which method to execute on selected tile based on the tool radio buttons
                    let toState;
                    if (document.getElementById("open").checked === true){
                        toState = NODE_OPEN;
                    } else if (document.getElementById("wall").checked === true){
                        toState = NODE_WALL;
                    } else if (document.getElementById("start").checked === true){
                        toState = NODE_START;
                    } else if (document.getElementById("goal").checked === true){
                        toState = NODE_GOAL;
                    }
                    
                    if (typeof toState !== "undefined"){
                        setNode(c, r, toState);
                    }
                    break;
                }
            }
            break;
        }
    }
}

function init(){
    canvas = document.getElementById("grid");
    
    ctx = canvas.getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx.strokeStyle = "#adadad"; //gray
    ctx.lineWidth = 1;
    
    //set some default values
    nodes[3][Math.floor(ROWS/2-1)].state = NODE_START;
    nodes[COLLUMS - 4][Math.floor(ROWS/2-1)].state = NODE_GOAL;
    document.getElementById("open").value = true;
    //draw the grid
    drawGrid();
};


/**
 * used to determine which color a square should be based on its state
 * each state has its own color which is only referenced here so the colors are also defined here
 * as long as the node state is updated through the constant NODE varriables, default should never execute
 * 
 * @param {type} state
 * @returns {String}
 */
function getNodeColor(state){
    switch(state){
        case NODE_OPEN:
            return "#F4D58D"; //peach-like
            break;
        case NODE_WALL:
            return "#001427"; //deep blue
            break;
        case NODE_START:
            return "#708D81"; //light blue
            break;
        case NODE_GOAL:
            return "#8D0801"; //reddish-brown
            break;
        case NODE_PATH:
            return "#D95730"; //orange
            break;
        case NODE_VISITED:
            return "#C4C4C4"; // off-white
            break;
        default:
            console.log("COLOR ERROR");
            return "#FFFFFF"; //black used to allow applicationt to contiue functioning but should never happen and may result errors elsewhere (and its visually noticeable)
    }
}

function drawGrid(){
    for(let c = 0; c < COLLUMS; c++){
        for(let r = 0; r < ROWS; r++){
            drawNode(nodes[c][r]);
        }
    }
}

function setNode(x, y, state){
    //if state is start or goal, the old one needs to be removed
    if (state === NODE_START || state === NODE_GOAL){
        let found = false;
        for(let c = 0; c < COLLUMS; c++){
            for(let r = 0; r < ROWS; r++){
                if (nodes[c][r].state === state){
                    nodes[c][r].state = NODE_OPEN;
                    drawNode(nodes[c][r]);
                    found = true;
                    break;
                }
            }
            if(found)break;
        }
    }
    
    //the start and goal nodes cannot be overwritten directly, to ensure functional behavior
    if (nodes[x][y].state !== NODE_START && nodes[x][y].state !== NODE_GOAL){
        nodes[x][y].state = state;
    }
    //regardless, redraw the node
    drawNode(nodes[x][y]);
}


//clears all path and visited nodes by making them open again
//intended to be called when the maze is solved and a node is altered aftewards
function clearSolved(){
    for (let c = 0; c < COLLUMS; c++){
        for (let r = 0; r < ROWS; r++){
            if (nodes[c][r].state === NODE_VISITED || nodes[c][r].state === NODE_PATH){
                nodes[c][r].state = NODE_OPEN;
                drawNode(nodes[c][r]);
            }
        }
    }
    justSolved = false;
    drawGrid();
}

//erases all tiles on the board and makes them open when the clear button is pushed
document.getElementById("clear").addEventListener("click", function (){
    if (controlsEnabled){
        for (let c = 0; c < COLLUMS; c++){
            for (let r = 0; r < ROWS; r++){
                nodes[c][r].state = NODE_OPEN;
            }
        }
        //reset the default position of the start and goal node
        nodes[3][Math.floor(ROWS/2-1)].state = NODE_START;
        nodes[COLLUMS - 4][Math.floor(ROWS/2-1)].state = NODE_GOAL;
        drawGrid();
    }
});

document.getElementById("solve").addEventListener("click", function (){
    if (controlsEnabled){
        controlsEnabled = false;
        clearSolved();
        if (document.getElementById("dijkstra").checked){
            dijkstra();
        } else if (document.getElementById("astar").checked){
            aStar();
        }
        justSolved = true;
    }
});

document.getElementById("recursive").addEventListener("click", function (){
    if (controlsEnabled){
        controlsEnabled = false;
        recursiveDivision();
    }
});

addEventListener("mousedown", function(e){
    if(controlsEnabled)mouseIsDown = true;
});

addEventListener("mouseup", function(e){
    if(controlsEnabled)mouseIsDown = false;
});

canvas.addEventListener("mousedown", function(e){
    if(controlsEnabled){
        if (justSolved) clearSolved();
        canvasAction();
    }
});

canvas.addEventListener("mousemove", function(e){
    if (controlsEnabled){
        if (mouseIsDown && justSolved) clearSolved();
        if (mouseIsDown)canvasAction();
    }
});

function setControls(state){
    controlsEnabled = state;
}

export {nodes, NODE_OPEN, NODE_START, NODE_GOAL, NODE_VISITED, NODE_WALL, NODE_PATH, COLLUMS, ROWS, drawNode, drawGrid, setControls};