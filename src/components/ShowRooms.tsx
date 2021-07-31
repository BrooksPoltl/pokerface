import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Room from './Room';

const ShowRooms = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [name, setName] = useState('');
  const history = useHistory();

  useEffect(() => {
    listRooms();
  }, []);

  const listRooms = async () => {
    const { data: rooms } = await axiosInstance.get('/rooms');
    setRoomsData(rooms);
  };

  const createRoom = async (e) => {
    e.preventDefault();
    const { data: { room } } = await axiosInstance.post('/rooms', { room: { name } });
    history.push(`/tables/${room.id}`);
  };
  return (
    <div>
      <div className="h-screen w-6/12">
        <div className="left-2/4 fixed transform top-16 -translate-x-1/2 flex flex-col">
          <div className="-my-2 max-h-96 overflow-y-auto  sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow o border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        host
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        players
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" bg-white divide-y divide-gray-200">
                    { roomsData.map((r) => <Room room={r} key={r.id} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <form className="flex flex-col text-center items-center">
            <p>create a room</p>
            <label htmlFor="name">
              <span>Name: </span>
              <input name="name" className="rounded border border-black" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <button className="m-2 w-6/12 border-2 border-purple-500 hover:border-gray-500" type="button" onClick={createRoom}>create room</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShowRooms;
