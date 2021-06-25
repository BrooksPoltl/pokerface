/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Socket } from 'phoenix';

import SelectionButtons from './SelectionButtons';
import { UserDataContext } from '../App';
import EventStream from './EventStream';

type Hand = {
  user_id: number,
  name: string,
  cash: number,
  card1: string,
  card2: string,
  is_big_user?: boolean,
  is_small_user?: boolean,
}

type Game = {
  card1: string,
  card2: string,
  card3: string,
  card4: string,
  card5: string,
  big_user_id: number,
  small_user_id: number,
  id: number,
}

export type PokerEvent = {
  type: string,
  amt: number,
  user_id: number,
  name: string
}

const Table = () => {
  const { roomId } = useParams();
  const [channel, setChannel] = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);
  const userData = useContext(UserDataContext);
  const [game, setGame] = useState<Game>({
    card1: null,
    card2: null,
    card3: null,
    card4: null,
    card5: null,
    id: null,
    big_user_id: null,
    small_user_id: null,
  });
  const [hands, setHands] = useState<Hand[]>([]);
  const [events, setEvents] = useState<PokerEvent[]>([]);

  const joinRoom = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = new Socket('ws://localhost:4000/socket', { params: { token } });
      await socket.connect();
      const chan = socket.channel(`tables:${roomId}`, {});
      chan.join().receive('ok', () => {
        chan.push('get_table').receive('ok', () => {});
      }).receive('error', (res) => console.log('error:', res));
      chan.on('get_table', ({ game }) => {
        // eslint-disable-next-line no-shadow
        setGame(game);
      });
      chan.on('new_turn', ({ user, hands }) => {
        setActivePlayer(user.user_id);
        setHands(hands);
      });
      chan.on('new_event', ({
        type, amt, user_id, turn,
      }) => {
        const hand = turn.hands.find((h) => h.user_id === user_id);
        setEvents((oldEvents) => [...oldEvents, {
          type, amt, user_id, name: hand.name,
        }]);
        setHands(turn.hands);
        setActivePlayer(turn.user.user_id);
      });
      setChannel(chan);
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
          <div className="mx-3">
            {' '}
            {h.name}
            {' '}
            {h.cash}
            {h.is_big_user && <p>B</p>}
            {h.is_small_user && <p>S</p>}
          </div>
          {activePlayer === h.user_id && <p>Active</p>}
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
      <SelectionButtons
        gameId={game.id}
        userData={userData}
        activePlayer={activePlayer}
        channel={channel}
      />
      <EventStream events={events} />
    </div>
  );
};

export default Table;
