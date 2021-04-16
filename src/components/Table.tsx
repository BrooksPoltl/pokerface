import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Table = () => {
  const { roomId } = useParams();
  console.log(roomId);
  const joinRoom = () => {

  };
  useEffect(() => {

  }, []);
  return (
    <div>
      <p>Welcome to the table!</p>
    </div>
  );
};

export default Table;
