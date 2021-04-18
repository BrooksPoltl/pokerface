import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'phoenix';

const Table = () => {
  const { roomId } = useParams();
  // const [channel, setChannel] = useState(null);
  const joinRoom = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = new Socket('ws://localhost:4000/socket', { params: { token } });
      await socket.connect();
      const channel = socket.channel(`tables:${roomId}`, {});
      channel.join().receive('ok', (res) => {
        console.log(res);
      }).receive('error', (res) => console.log('error:', res));
    }
  };
  useEffect(() => {
    joinRoom();
  }, []);
  return (
    <div>
      <p>Welcome to the table!</p>
    </div>
  );
};

export default Table;
