import React, { useState } from 'react';
import Room from './Room';

const ShowRooms = () => {
  const [rooms, setRooms] = useState([]);

  const createRoom = (e) => {
    e.preventDefault();
    setRooms([]);
  };
  return (
    <div>
      aadad
      { rooms.map((room) => <Room room={room} />)}
      <button type="button" onClick={createRoom}>create room</button>
    </div>
  );
};

export default ShowRooms;

/*
  room
   user_id: user that created room
   name of room

*/
