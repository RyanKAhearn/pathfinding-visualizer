/**
 * An implementation of Dijkstra's algorithm that returns a list of all visited nodes in the
 * order in which they were visited. The nodes contain a pointer to the previous node that
 * can be used to construct the shortest path between the node and the start.
 * 
 * @param {*} grid A 2d array of nodes representing the search area.
 * @param {*} startNode The starting node for the search.
 * @param {*} endNode The node to seach for.
 */
export function dijkstra(grid, startNode, endNode) {
    let nodesToVisit = [startNode];
    let visitedNodes = []
    startNode.distance = 0;
    startNode.seen = true;
    while (nodesToVisit.length > 0) {
        let closestNode = getClosestNode(nodesToVisit);
        visitedNodes.push(closestNode);

        if (closestNode == endNode) {
            return visitedNodes;
        }

        getNeighbors(closestNode, grid, nodesToVisit);
    }
    return visitedNodes;
}

/**
 * Removes and returns the node with the smallest distance. If there is more than one
 * node with the same smallest distance then the one with the smaller index is removed
 * and returned.
 * 
 * @param {*} nodes A list of unvisited nodes.
 */
function getClosestNode(nodes) {
    let closestIndex = 0;
    for (let i = 1; i < nodes.length; i++) {
        if (nodes[closestIndex].distance > nodes[i].distance) {
            closestIndex = i;
        }
    }

    if (closestIndex != nodes.length - 1) {
        let temp = nodes[closestIndex];
        nodes[closestIndex] = nodes[nodes.length - 1];
        nodes[nodes.length - 1] = temp;
    }

    return nodes.pop();
}

/**
 * Updates the distance from the start of the four nodes that share and edge with the closestNode.
 * Any encountered node that is not a wall and has not yet been added to nodesToVisit list will be
 * added to the list.
 * 
 * @param {*} closestNode The node to expand.
 * @param {*} grid The grid of nodes representing the search area.
 * @param {*} nodesToVisit The list of nodes unvisited nodes.
 */
function getNeighbors(closestNode, grid, nodesToVisit) {
    let { row, col, distance } = closestNode;

    if (row > 0) {
        let node = grid[row-1][col];
        if (node.distance > distance + node.weight) {
            node.distance = distance + node.weight;
            node.previous = closestNode;
        }
        if (!node.seen && !node.isWall) {
            node.seen = true;
            nodesToVisit.push(node);
        }
    }

    if (row < grid.length - 1) {
        let node = grid[row+1][col];
        if (node.distance > distance + node.weight) {
            node.distance = distance + node.weight;
            node.previous = closestNode;
        }
        if (!node.seen && !node.isWall) {
            node.seen = true;
            nodesToVisit.push(node);
        }
    }

    if (col > 0) {
        let node = grid[row][col - 1];
        if (node.distance > distance + node.weight) {
            node.distance = distance + node.weight;
            node.previous = closestNode;
        }
        if (!node.seen && !node.isWall) {
            node.seen = true;
            nodesToVisit.push(node);
        }
    }

    if (col < grid[row].length - 1) {
        let node = grid[row][col+1];
        
        if (node.distance > distance + node.weight) {
            node.distance = distance + node.weight;
            node.previous = closestNode;
        }
        if (!node.seen && !node.isWall) {
            node.seen = true;
            nodesToVisit.push(node);
        }
    }
}