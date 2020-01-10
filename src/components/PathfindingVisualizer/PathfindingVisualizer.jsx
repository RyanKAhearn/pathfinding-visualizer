import React, { useEffect, useState } from 'react';
import { Node } from '../Node/Node';


import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;


export default function PathfindingVisualizer(props) {
    const [grid, setGrid] = useState(getInitialGrid());
    return (
        <>
            <button>Visualize Dijkstra's Algorithm</button>
            <div className="grid">
                {grid.map((row, rowIdx) => {
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

function createNode(row, col) {
    const ref = React.createRef();
    return {
        row,
        col,
        ref,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        seen: false,
        isWall: false,
        previousNode: null
    }
}