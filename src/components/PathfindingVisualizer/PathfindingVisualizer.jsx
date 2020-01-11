import React, { useEffect, useState } from 'react';
import { Node } from '../Node/Node';


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
            <button>Visualize Dijkstra's Algorithm</button>
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

function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};