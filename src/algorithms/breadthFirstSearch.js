export function breadthFirstSearch(grid, startNode, endNode) {
  let queue = [startNode];
  let visitedNodes = [];
  startNode.seen = true;

  while (queue.length > 0) {
    const node = queue.shift();
    visitedNodes.push(node);

    if (node === endNode) {
      return visitedNodes;
    }

    getNeighbors(node, grid, queue);
  }
  return visitedNodes;
}


/**
 * Adds any of the four nodes that share an edge with the closestNode that are not walls and have not
 * yet been seen to the list of nodesToVisit.
 * 
 * @param {*} closestNode The node to expand.
 * @param {*} grid The grid of nodes representing the search area.
 * @param {*} nodesToVisit The list of nodes unvisited nodes.
 */
function getNeighbors(closestNode, grid, nodesToVisit) {
  let { row, col } = closestNode;

  if (row > 0) {
    let node = grid[row - 1][col];
    if (!node.seen && !node.isWall) {
      node.seen = true;
      node.previousNode = closestNode;
      nodesToVisit.push(node);
    }
  }

  if (row < grid.length - 1) {
    let node = grid[row + 1][col];
    if (!node.seen && !node.isWall) {
      node.seen = true;
      node.previousNode = closestNode;
      nodesToVisit.push(node);
    }
  }

  if (col > 0) {
    let node = grid[row][col - 1];
    if (!node.seen && !node.isWall) {
      node.seen = true;
      node.previousNode = closestNode;
      nodesToVisit.push(node);
    }
  }

  if (col < grid[row].length - 1) {
    let node = grid[row][col + 1];
    if (!node.seen && !node.isWall) {
      node.seen = true;
      node.previousNode = closestNode;
      nodesToVisit.push(node);
    }
  }
}