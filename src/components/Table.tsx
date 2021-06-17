import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'phoenix';

const Table = () => {
  const { roomId } = useParams();
  const [channel, setChannel] = useState(null);
  const [game, setGame] = useState({
    card1: null, card2: null, card3: null, card4: null, card5: null,
  });
  const [hands, setHands] = useState([]);
  const joinRoom = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = new Socket('ws://localhost:4000/socket', { params: { token } });
      await socket.connect();
      const chan = socket.channel(`tables:${roomId}`, {});
      chan.join().receive('ok', () => {
        chan.push('get_table').receive('ok', () => {});
      }).receive('error', (res) => console.log('error:', res));
      chan.on('get_table', (res) => {
        // eslint-disable-next-line no-shadow
        const { game, hands } = res;
        setGame(game);
        setHands(hands);
      });

      setChannel(channel);
    }
  };
  useEffect(() => {
    joinRoom();
  }, []);
  return (
    <div>
      <p>Welcome to the table!</p>
      { hands.map((h) => (
        <div className="flex m-3" key={h.user_id}>
          <p className="mx-3">
            {' '}
            {h.name}
          </p>
          card1:
          {' '}
          <p className="mx-3">{h.card1 ? h.card1 : '??'}</p>
          card2:
          {' '}
          <p className="mx-3">{h.card2 ? h.card2 : '??'}</p>
        </div>
      ))}
      <div>
        <div>
          cards:
          {' '}
          <p className="mx-3">
            card1:
            {' '}
            {game.card1 ? game.card1 : '??' }
          </p>
          {' '}
          <p className="mx-3">
            card2:
            {' '}
            {game.card2 ? game.card2 : '??' }
          </p>
          {' '}
          <p className="mx-3">
            card3:
            {' '}
            {game.card3 ? game.card3 : '??' }
          </p>
          {' '}
          <p className="mx-3">
            card4:
            {' '}
            {game.card4 ? game.card4 : '??' }
          </p>
          {' '}
          <p className="mx-3">
            card5:
            {' '}
            {game.card5 ? game.card5 : '??' }
          </p>

        </div>
      </div>
    </div>
  );
};

export default Table;
