import React from 'react';

import './Node.css';

export const Node = React.forwardRef((props, ref) => {
    const {
        row,
        col,
        isFinish,
        isStart,
        isWall,
    } = props;
    const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';
    return (
        <div
            name='node'
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            ref={ref}></div>
    );
})