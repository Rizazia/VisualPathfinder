# Visual Pathfinder
This Javascript program calculates the shortest path between two nodes that are called the start and goal nodes respectivly. There are three algorithms that can be used in the program; two for pathfinding and one that will generate a maze. The pathfinding algorithms are Dijkstra's Algorithm and A Star, while the maze generation algorithm is Recursive Division.

General information of the application:

The teal node is the start node, only one can exist, and is where the algorithms start

The red node is the goal node, only one can exist, and is the node the algorithms are looking for

The dark blue nodes are walls and algorithms cannot traveserse these nodes

The gray nodes are visited nodes which show nodes that the algorithm has travelled through while solving and can only be created through the algorithms

The orange nodes are the path calculated by the algorithms upon completion


## Dijkstra Pathfinding
![Dijkstra Demonstration](https://raw.githubusercontent.com/Rizazia/images/main/dijkstra.jpg)
An algorthm that finds the shortest path to the goal by searching the node closest unvisited node to the start node and keeping track of the nodes traversed to create the path.

## A Star Pathfinding
![A Star Demonstration](https://raw.githubusercontent.com/Rizazia/images/main/aStar.jpg)
An algorithm that finds the shortest path to the goal by searching the adjacent node that is the closest to the goal by calculating heuristic values about how far the node is from the goal.

## Recursive Division Maze Generation
![Recursive division Demonstration](https://github.com/Rizazia/images/blob/main/recDivision.jpg)
A maze generation algorithm that makes a straight wall and the puts a hole in it before recurisvly recalling itself with a smaller view of where it can create walls. Once the algorithm finishes the start node is randomly placed on the left edge while the goal node is placed on the right edge randomly.
