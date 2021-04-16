import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import Room from './Room';

const ShowRooms = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    listRooms();
  }, []);

  const listRooms = async () => {
    const { data: rooms } = await axiosInstance.get('/rooms');
    setRoomsData(rooms);
  };

  const createRoom = async (e) => {
    e.preventDefault();
    await axiosInstance.post('/rooms', { room: { name } });
    setName('');
    listRooms();
  };
  return (
    <div>
      { roomsData.map((r) => <Room room={r} />)}
      <form className="flex flex-col text-center items-center">
        <p>Please create a room</p>
        <label htmlFor="name">
          <span>Name: </span>
          <input name="name" className="rounded border border-black" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button className="m-2 w-3/12 border-2 border-purple-500 hover:border-gray-500" type="button" onClick={createRoom}>create room</button>
      </form>
    </div>
  );
};

export default ShowRooms;

/*
  room
   user_id: user that created room
   name of room

*/
