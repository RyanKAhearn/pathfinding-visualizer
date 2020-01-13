import React, { useEffect, useState } from 'react';
import { Node } from '../Node/Node';
import { dijkstra } from '../../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;


export default function PathfindingVisualizer(props) {
  const [state, setState] = useState({
    grid: getInitialGrid(),
    mouseIsPressed: false
  });

  useEffect(() => {
    const handleMouseDown = (e) => {
      e.preventDefault();
      if (e.target.id.startsWith('node')) {
        let parts = e.target.id.split('-');
        setState(s => ({
          ...s,
          grid: getNewGridWithWallToggled(s.grid, parseInt(parts[1]), parseInt(parts[2])),
          mouseIsPressed: true
        }));
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


    const handleMouseEnter = (e) => {
      setState(s => {
        if (s.mouseIsPressed && e.target.id.startsWith('node')) {
          let parts = e.target.id.split('-');
          return {
            ...s,
            grid: getNewGridWithWallToggled(s.grid, parseInt(parts[1]), parseInt(parts[2])),
            mouseIsPressed: true
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
      document.removeEventListener('mouseenter', handleMouseEnter);
    }
  }, []);

  return (
    <>
      <button onClick={() =>
        visualizeDijkstra(state.grid, state.grid[START_NODE_ROW][START_NODE_COL], state.grid[FINISH_NODE_ROW][FINISH_NODE_COL])
      }>Visualize Dijkstra's Algorithm</button>
      <button onClick={() => setState({
        ...state,
        grid: clearGrid(state.grid)
      })}>Clear Board</button>
      <div className="grid">
        {state.grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, colIdx) => {
                const { row, col, isFinish, isStart, isWall, ref } = node;
                return (
                  <Node
                    ref={ref}
                    row={row}
                    col={col}
                    key={colIdx}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall} />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

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

function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function visualizeDijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
  animateSearch(visitedNodesInOrder, endNode);
}

function animateSearch(visitedNodesInOrder, endNode) {
  for (let i = 1; i < visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length - 1 && visitedNodesInOrder === endNode) {
      setTimeout(() => animateShortestPath(endNode.previousNode), 10 * i);
    } else {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        node.ref.current.className = 'node node-visited';
      }, 10 * i);
    }
  }
}

function animateShortestPath(node) {
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