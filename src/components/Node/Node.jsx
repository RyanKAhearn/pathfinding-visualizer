import React from 'react';

import './Node.css';

export default Node = React.forwardRef((props, ref) => {
    const {
        isFinish,
        isStart,
        isWall,
    } = props;
    const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';
    return (
        <div
            name='node'
            className={`node ${extraClassName}`}
            ref={ref}></div>
    );
})