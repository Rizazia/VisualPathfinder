'use strict';
import {nodes, NODE_OPEN, NODE_START, NODE_GOAL, NODE_VISITED, NODE_PATH, NODE_WALL, COLLUMS, ROWS, drawNode, setControls} from "../VisualPathfinder.js";

var complete = false;
function dijkstra (){
    let startNode;
    //set the distance of all nodes to infinite except the start
    for (let c = 0; c < nodes.length; c++){
        for(let r = 0; r < nodes[c].length; r++){
            if(nodes[c][r].state !== NODE_START){
                nodes[c][r].distance = Number.POSITIVE_INFINITY;
                nodes[c][r].toVisit = false;
            } else {
                startNode = nodes[c][r];
                nodes[c][r].distance = 0;
                nodes[c][r].toVisit = true;
            }
        }
    }
    calcDistance(startNode);
}

function calcDistance(curNode){
    complete = false;

    //if the node is the goal, clear all toVisits and call executePath
    if (curNode.state === NODE_GOAL){
        for(let c = 0; c < COLLUMS; c++){
            for (let r = 0; r < ROWS; r++){
                nodes[c][r].toVisit = false;
            }
        }
        complete = true;
        createPath(curNode);
    } else { //continue the algorithm
        //update the cur node in the permanent array and redraw the node
        nodes[curNode.col][curNode.row].toVisit = false;
        if(curNode.state !== NODE_START)nodes[curNode.col][curNode.row].state = NODE_VISITED;
        drawNode(curNode);
        
        //update the adjacent nodes       
        if (curNode.col - 1 >= 0){
            if (nodes[curNode.col-1][curNode.row].state === NODE_OPEN || nodes[curNode.col-1][curNode.row].state === NODE_GOAL){
                nodes[curNode.col-1][curNode.row].distance = curNode.distance + 1;
                nodes[curNode.col-1][curNode.row].toVisit = true;
            }
        }
        if (curNode.row + 1 < ROWS){
            if (nodes[curNode.col][curNode.row+1].state === NODE_OPEN || nodes[curNode.col][curNode.row+1].state === NODE_GOAL){
                nodes[curNode.col][curNode.row+1].distance = curNode.distance + 1;
                nodes[curNode.col][curNode.row+1].toVisit = true;
            }
        }
        if (curNode.row - 1 >= 0){
            if (nodes[curNode.col][curNode.row-1].state === NODE_OPEN || nodes[curNode.col][curNode.row-1].state === NODE_GOAL){
                nodes[curNode.col][curNode.row-1].distance = curNode.distance + 1;
                nodes[curNode.col][curNode.row-1].toVisit = true;
            }
        }
        if (curNode.col + 1 < COLLUMS){
            if (nodes[curNode.col+1][curNode.row].state === NODE_OPEN || nodes[curNode.col+1][curNode.row].state === NODE_GOAL){
                nodes[curNode.col+1][curNode.row].distance = curNode.distance + 1;
                nodes[curNode.col+1][curNode.row].toVisit = true;
            }
        }
    }
    //find closest node
    let tempNode = {distance: Number.POSITIVE_INFINITY};
    for(let c = 0; c < COLLUMS; c++){
        for (let r = 0; r < ROWS; r++){
            if (nodes[c][r].toVisit === true && nodes[c][r].distance < tempNode.distance){
                tempNode = nodes[c][r];
            }
        }
    }
    setTimeout(function(){
        if(!complete && tempNode.distance !== Number.POSITIVE_INFINITY){calcDistance(tempNode);}
        else setControls(true);
    }, 10);
}

function createPath(curNode){
    let path = [];
    
    while (curNode.state !== NODE_START){
       //add curNode to the path
       path.push(curNode);
       //find the node adjacent to curNode with the shortest distance
       if (curNode.col-1 >= 0 && nodes[curNode.col-1][curNode.row].distance < curNode.distance)
           curNode = nodes[curNode.col-1][curNode.row];
       else if (curNode.col+1 < COLLUMS && nodes[curNode.col+1][curNode.row].distance < curNode.distance)
           curNode = nodes[curNode.col+1][curNode.row];
       else if (curNode.row-1 >= 0 && nodes[curNode.col][curNode.row-1].distance < curNode.distance)
           curNode = nodes[curNode.col][curNode.row-1];
       else if (curNode.row+1 < ROWS && nodes[curNode.col][curNode.row+1].distance < curNode.distance)
           curNode = nodes[curNode.col][curNode.row+1];
    }
    fillPath(path);
    setControls(true);
}

function fillPath(path){
    let thisNode; //used soley for readability, alternative is to use path[path.length - 1] EVERY time I refrence the current node in the path

    thisNode = path[path.length - 1];

    if (thisNode.state !== NODE_GOAL)nodes[thisNode.col][thisNode.row].state = NODE_PATH;
    drawNode(nodes[thisNode.col][thisNode.row]);
    path.pop();
    setTimeout(function(){if (path.length > 0)fillPath(path);}, 10);
    complete = true;
}

export {dijkstra};