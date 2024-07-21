import React from 'react';

const Filter = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Search by name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
    />
  );
};

export default Filter; 
