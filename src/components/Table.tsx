import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'phoenix';

const Table = () => {
  const { roomId } = useParams();
  const [channel, setChannel] = useState(null);
  const [table, setTable] = useState([]);
  const joinRoom = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = new Socket('ws://localhost:4000/socket', { params: { token } });
      await socket.connect();
      const chan = socket.channel(`tables:${roomId}`, {});
      chan.join().receive('ok', () => {
      }).receive('error', (res) => console.log('error:', res));
      chan.push('join_get_table').receive('ok', (res) => {
        setTable(res);
      });
    }
    setChannel(channel);
  };
  useEffect(() => {
    joinRoom();
  }, []);
  return (
    <div>
      <p>Welcome to the table!</p>
      { table.map((t) => <div key={t.user_id}>{t.username}</div>)}
    </div>
  );
};

export default Table;
