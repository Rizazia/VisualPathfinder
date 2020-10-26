"use strict";
import {nodes, NODE_OPEN, NODE_START, NODE_GOAL, NODE_VISITED, NODE_PATH, NODE_WALL, COLLUMS, ROWS, drawNode, setControls} from "../VisualPathfinder.js";

var startNode;
var goalNode;
var openSet = [];
var complete;

function aStar(){
    //setup
    //set distances to all non-start & non-goal nodes with inital values and set startNode and goalNode
    for(let c = 0; c < COLLUMS; c++){
        for(let r = 0; r < ROWS; r++){
            nodes[c][r].sCost = Number.POSITIVE_INFINITY;
            nodes[c][r].gCost = Number.POSITIVE_INFINITY;
            nodes[c][r].tCost = Number.POSITIVE_INFINITY;
            switch (nodes[c][r].state){
                case NODE_START:
                    startNode = nodes[c][r];
                    startNode.sCost = 0;
                    break;
                case NODE_GOAL:
                    goalNode = nodes[c][r];
                    break;
            }
        }
    }
    complete = false;
    openSet.unshift(startNode);
    calcAStar(startNode);
}

function calcAStar(curNode){
    //handle state of curNode
    setTimeout(function(){
        switch (curNode.state){
            case NODE_GOAL:
                complete = true;
                calcPath(curNode);
                break;
            case NODE_START:
                break;
            default: //NODE_OPEN or NODE_VISITED
                curNode.state = NODE_VISITED;
                drawNode(curNode);
        }
    }, 10);
    openSet.shift();
    
    //add all traversable neighbors not in closedSet
    let neighborNode;
    if (!complete && curNode.col-1 >= 0){
        neighborNode = nodes[curNode.col-1][curNode.row];
        if (neighborNode.state !== NODE_WALL && neighborNode.state !== NODE_START){
            calcDistance(neighborNode, curNode);
            if (!openSet.includes(neighborNode) && neighborNode.state !== NODE_VISITED)openSet.unshift(neighborNode);
        }
    }
    if (!complete && curNode.row-1 >= 0){
        neighborNode = nodes[curNode.col][curNode.row-1];
        if (neighborNode.state !== NODE_WALL && neighborNode.state !== NODE_START){
            calcDistance(neighborNode, curNode);
            if (!openSet.includes(neighborNode) && neighborNode.state !== NODE_VISITED)openSet.unshift(neighborNode);
        }
    }
    if (!complete && curNode.col+1 < COLLUMS){
        neighborNode = nodes[curNode.col+1][curNode.row];
        if (neighborNode.state !== NODE_WALL && neighborNode.state !== NODE_START){
            calcDistance(neighborNode, curNode);
            if (!openSet.includes(neighborNode) && neighborNode.state !== NODE_VISITED)openSet.unshift(neighborNode);
        }
    }
    if (!complete && curNode.row+1 > 0){
        neighborNode = nodes[curNode.col][curNode.row+1];
        if (neighborNode.state !== NODE_WALL && neighborNode.state !== NODE_START){
            calcDistance(neighborNode, curNode);
            if (!openSet.includes(neighborNode) && neighborNode.state !== NODE_VISITED)openSet.unshift(neighborNode);
        }
    }
    openSet.sort((a,b) => (a.tCost > b.tCost) ? 1 : (a.tCost === b.tCost) ? ((a.gCost > b.gCost) ? 1 : -1) : -1);
    setTimeout(function(){if (!complete) calcAStar(openSet[0]);}, 50);
}

function calcDistance(node, prevNode){
    let tempS = prevNode.sCost+1;
    let tempG = Math.hypot(node.col - goalNode.col, node.row - goalNode.row);
    let tempT = tempS + tempG;

    if (tempT < node.tCost){ //the new distance is shorter than the old one, update it
        node.sCost = tempS;
        node.gCost = tempG;
        node.tCost = tempT;
        node.previous = prevNode.id;
    }

}

function calcPath(curNode){
    let path = [curNode];
    while (path[0].state !== NODE_START){
        for (let c = 0; c < COLLUMS; c++){
            for (let r = 0; r < ROWS; r++){
                if (nodes[c][r].id === curNode.previous){
                    path.unshift(nodes[c][r]);
                    curNode = nodes[c][r];
                    break;
                }
            }
        }
    }
    if (path.length > 0) drawPath(path);
}

function drawPath(path){
    if(path[0].state !== NODE_GOAL && path[0].state !== NODE_START)path[0].state = NODE_PATH;
    drawNode(path[0]);
    path.shift();
    
    setTimeout(function(){
        if (path.length > 0) drawPath(path);
        else setControls(true);
        }, 20);
}

export {aStar};