'use strict';
import {nodes, NODE_OPEN, NODE_START, NODE_GOAL, NODE_WALL, COLLUMS, ROWS, drawNode, drawGrid, setControls} from "../VisualPathfinder.js";


function recursiveDivision(){
    //set up
    for (let c = 0; c < COLLUMS; c++){
        for (let r = 0; r < ROWS; r++){
            nodes[c][r].state = NODE_OPEN;
            drawNode(nodes[c][r]);
        }
    }
    //execute algorithm
    setTimeout(function(){generateOuterWalls();}, 10);
    setTimeout(function(){generateMaze(true, 1, ROWS-2, 1, COLLUMS-1);}, 0);
    setTimeout(function(){addStartGoal();}, 10);
}

function generateOuterWalls() {
    for (let c = 0; c < COLLUMS; c++) {
        if (c === 0 || c === COLLUMS - 1) {
            for (let r = 0; r < ROWS; r++) {
                nodes[c][r].state = NODE_WALL;
            }
        } else {
            nodes[c][0].state = NODE_WALL;
            nodes[c][ROWS - 1].state = NODE_WALL;
            
        }
    }
    drawGrid();
}

function addStartGoal() {
    let random = rand(1, ROWS - 1);
    nodes[0][random].state = NODE_START;
    drawNode(nodes[0][random]);
    //ensure the adjacent node is traverseable
    nodes[1][random].state = NODE_OPEN;
    
    random = rand(1, ROWS - 1);
    nodes[COLLUMS-1][random].state = NODE_GOAL;
    drawNode(nodes[COLLUMS-1][random]);
    //ensure the adjacent node is traverseable
    nodes[COLLUMS-2][random].state = NODE_OPEN;
    setControls(true);
}

function generateMaze(isHorizontal, minX, maxX, minY, maxY) {
    if (isHorizontal) {
        if (maxX - minX < 2)return;
        
        let c = Math.floor(rand(minY, maxY)/2)*2;
        createHorizontalWalls(minX, maxX, c);
        
        setTimeout(function(){generateMaze(!isHorizontal, minX, maxX, minY, c-1);}, 0);
        setTimeout(function(){generateMaze(!isHorizontal, minX, maxX, c+1, maxY);}, 0);
    } else {
        if (maxY - minY < 2)return;
        
        let x = Math.floor(rand(minX, maxX)/2)*2;
        createVerticalWalls(minY, maxY, x);

        setTimeout(function(){generateMaze(!isHorizontal, minX, x-1, minY, maxY);}, 0);
        setTimeout(function(){generateMaze(!isHorizontal, x + 1, maxX, minY, maxY);}, 0);
    }
}

function createHorizontalWalls(minX, maxX, c) {
    let hole = Math.floor(rand(minX, maxX)/2)*2+1;

    for (let r = minX; r < maxX; r++) {
        if (r === hole && nodes[c][r].state !== NODE_START && nodes[c][r].state !== NODE_GOAL) nodes[c][r].state = NODE_OPEN;
        else if (nodes[c][r].state !== NODE_START || nodes[c][r].state !== NODE_GOAL) nodes[c][r].state = NODE_WALL;
        drawNode(nodes[c][r]);
    }
}

function createVerticalWalls(minY, maxY, r) {
    let hole = Math.floor(rand(minY, maxY)/2)*2+1;
    
    for (let c = minY; c < maxY; c++) {
        if (c === hole && nodes[c][r].state !== NODE_START && nodes[c][r].state !== NODE_GOAL) nodes[c][r].state = NODE_OPEN;
        else if (nodes[c][r].state !== NODE_START && nodes[c][r].state !== NODE_GOAL) nodes[c][r].state = NODE_WALL;
        drawNode(nodes[c][r]);
    }
}

function rand (min, max){
    return Math.floor(Math.random()*(max-min) + min);
}

export {recursiveDivision};