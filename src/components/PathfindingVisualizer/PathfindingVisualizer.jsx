import React, { useEffect, useState } from 'react';
import { Node } from '../Node/Node';
import { dijkstra } from '../../algorithms/dijkstra';

import './PathfindingVisualizer.css';
import { breadthFirstSearch } from '../../algorithms/breadthFirstSearch';
import { depthFirstSearch } from '../../algorithms/depthFisrtSearch';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;


export default function PathfindingVisualizer(props) {
  const [state, setState] = useState({
    grid: getInitialGrid(),
    mouseIsPressed: false,
    wIsPressed: false
  });

  useEffect(() => {
    const handleMouseDown = (e) => {
      e.preventDefault();
      if (e.target.id.startsWith('node')) {
        let parts = e.target.id.split('-');
        setState(s => 
          s.wIsPressed ? {
            ...s,
            grid: getNewGridWithWeightToggled(s.grid, parseInt(parts[1]), parseInt(parts[2])),
            mouseIsPressed: true
          } : {
            ...s,
            grid: getNewGridWithWallToggled(s.grid, parseInt(parts[1]), parseInt(parts[2])),
            mouseIsPressed: true
          }
        );
      } else {
        setState(s => ({
          ...s,
          mouseIsPressed: true
        }));
      }
    }
    document.addEventListener('mousedown', handleMouseDown);

    const handleMouseUp = () => {
      setState(s => ({
        ...s,
        mouseIsPressed: false
      }));
    }
    document.addEventListener('mouseup', handleMouseUp);

    const handleKeyDown = (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      
      if (e.code === 'KeyW') {
        setState(s => s.wIsPressed ? s : ({
          ...s,
          wIsPressed: true
        }));
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    const handleKeyUp = (e) => {
      if (e.isComposing || e.keyCode === 229) return;

      if (e.code === 'KeyW') {
        setState(s => ({
          ...s,
          wIsPressed: false
        }));
      }
    }
    document.addEventListener('keyup', handleKeyUp);

    const handleMouseEnter = (e) => {
      setState(s => {
        if (s.mouseIsPressed && e.target.id.startsWith('node')) {
          let parts = e.target.id.split('-');
          return s.wIsPressed ? {
            ...s,
            grid: getNewGridWithWeightToggled(s.grid, parseInt(parts[1]), parseInt(parts[2])),
          } : {
            ...s,
            grid: getNewGridWithWallToggled(s.grid, parseInt(parts[1]), parseInt(parts[2])),
          };
        } else {
          return s;
        }
      })
    }
    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
    }
  }, []);

  return (
    <>
      <nav className="navbar">
        <button onClick={() =>
          visualizeDijkstra(state.grid, state.grid[START_NODE_ROW][START_NODE_COL], state.grid[FINISH_NODE_ROW][FINISH_NODE_COL])
        }>Visualize Dijkstra's Algorithm</button>
        <button onClick={() =>
          visualizeBreadthFirstSearch(state.grid, state.grid[START_NODE_ROW][START_NODE_COL], state.grid[FINISH_NODE_ROW][FINISH_NODE_COL])
        }>Visualize BFS Algorithm</button>
        <button onClick={() =>
          visualizeDepthFirstSearch(state.grid, state.grid[START_NODE_ROW][START_NODE_COL], state.grid[FINISH_NODE_ROW][FINISH_NODE_COL])
        }>Visualize DFS Algorithm</button>
        <button onClick={() => setState({
          ...state,
          grid: clearGrid(state.grid)
        })}>Clear Board</button>
      </nav>
      <p>
        Use the mouse to toggle walls. Hold down the w key and use the mouse to add/remove weight to the nodes.
      </p>
      <div className="grid">
        {state.grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, colIdx) => {
                const { row, col, isFinish, isStart, isWall, ref, weight } = node;
                return (
                  <Node
                    ref={ref}
                    row={row}
                    col={col}
                    key={colIdx}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    weight={weight} />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

/**
 * Create and return the initial grid of nodes.
 */
function getInitialGrid() {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
}

/**
 * Return a new grid reset to its initial state.
 * 
 * @param {*} grid The current grid.
 */
function clearGrid(grid) {
  return grid.map(row => 
    row.map(node => {
      const { isFinish, isStart } = node;
      const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : '';
      node.ref.current.className = `node ${extraClassName}`;
      return {
        ...node,
        isWall: false,
        weight: 1,
        seen: false,
        distance: Infinity,
        previousNode: null
      }
    }));
}

/**
 * Create and return a new node that is to be located at the specified row and column.
 * 
 * @param {*} row The 0 based index of row the node will be located at.
 * @param {*} col The 0 based index of the column the node will be located at.
 */
function createNode(row, col) {
  const ref = React.createRef();
  return {
    row,
    col,
    ref,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    weight: 1,
    seen: false,
    isWall: false,
    previousNode: null
  }
}

/**
 * Returns a new grid with state of the node at the specified row and column
 * being changed so the it is a wall only if it is not currently a wall.
 * 
 * @param {*} grid The current grid of nodes.
 * @param {*} row The row of the node to toggle.
 * @param {*} col The column of the node to toggle.
 */
function getNewGridWithWallToggled(grid, row, col) {
  if (grid[row][col].isStart || grid[row][col].isFinish) {
    return grid;
  }
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

/**
 * Returns a new grid with the node at the specified row and column
 * having its weight changed from 1 to 10 or 10 to 1.
 * 
 * @param {*} grid The current grid of nodes.
 * @param {*} row The row of the node to change.
 * @param {*} col The column of the node to change.
 */
function getNewGridWithWeightToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    weight: node.weight ^ 11,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function visualizeDijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
  animateSearch(visitedNodesInOrder, endNode);
}

function visualizeBreadthFirstSearch(grid, startNode, endNode) {
  const visitedNodesInOrder = breadthFirstSearch(grid, startNode, endNode);
  animateSearch(visitedNodesInOrder, endNode);
}

function visualizeDepthFirstSearch(grid, startNode, endNode) {
  const visitedNodesInOrder = depthFirstSearch(grid, startNode, endNode);
  animateSearch(visitedNodesInOrder, endNode);
}

/**
 * Causes the animation of the search to run.
 * 
 * @param {*} visitedNodesInOrder The list of nodes in the order the search algorithm visited them.
 * @param {*} endNode The node the search algorithm was looking for.
 */
function animateSearch(visitedNodesInOrder, endNode) {
  for (let i = 1; i < visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length - 1 && visitedNodesInOrder[i] === endNode) {
      setTimeout(() => animatePath(endNode.previousNode), 10 * i);
    } else {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        node.ref.current.className = 'node node-visited';
      }, 10 * i);
    }
  }
}

/**
 * Causes the animation of the path found by the search algorithm to run.
 * 
 * @param {*} node The last node in the path.
 */
function animatePath(node) {
  let i = 0;
  while (node !== null && node.previousNode !== null) {
    setTimeout(((n) => {
      return () => {
        n.ref.current.className = 'node node-shortest-path';
      }
    })(node), 50 * i);
    node = node.previousNode;
    i++;
  }
}