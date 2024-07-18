import React from 'react';

const Content = ({ parts }) => {
  return (
    <div>
      <div>
        <p>{parts[0].name} {parts[0].exercises}</p>
      </div>
      <div>
        <p>{parts[1].name} {parts[1].exercises}</p>
      </div>
      <div>
        <p>{parts[2].name} {parts[2].exercises}</p>
      </div>
    </div>
  );
};

export default Content;
