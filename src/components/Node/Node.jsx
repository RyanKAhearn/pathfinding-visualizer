import React from 'react';

import './Node.css';

export const Node = React.forwardRef((props, ref) => {
  const {
    row,
    col,
    isFinish,
    isStart,
    isWall,
    weight
  } = props;
  const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : weight > 1 ? 'node-weight' : '';
  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      ref={ref}
      draggable="false"></div>
  );
})