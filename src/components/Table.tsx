/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

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
  amount_bet_this_round: number,
}

type Game = {
  card1: string,
  card2: string,
  card3: string,
  card4: string,
  card5: string,
  pot_size: number,
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
  const history = useHistory();
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
    pot_size: 0,
    big_user_id: null,
    small_user_id: null,
  });
  const [hands, setHands] = useState<Hand[]>([]);
  const [events, setEvents] = useState<PokerEvent[]>([]);

  const joinRoom = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const baseURL = process.env.NODE_ENV === 'development' ? 'ws://localhost:4000/socket' : 'wss://gaga-pokerface.herokuapp.com/socket';

      const socket = new Socket(baseURL, { params: { token } });
      await socket.connect();
      const chan = socket.channel(`tables:${roomId}`, {});
      chan.join().receive('ok', () => {
        chan.push('get_table').receive('ok', () => {});
      });
      // .log('error:', res));
      chan.on('get_table', ({ game }) => {
        // eslint-disable-next-line no-shadow
        setGame(game);
      });
      chan.on('new_turn', ({ user_id, hands }) => {
        // TODO: I probably don't need this
        setActivePlayer(user_id);
        setHands(hands);
      });
      chan.on('new_event', ({
        type, amt, user_id, turn, game,
      }) => {
        const hand = turn.hands.find((h) => h.user_id === user_id);
        setEvents((oldEvents) => [...oldEvents, {
          type, amt, user_id, name: hand.name,
        }]);
        if (game) {
          setGame(game);
        }

        setHands(turn.hands);
        setActivePlayer(turn.user_id);
      });
      chan.on('game_over', ({ users }) => {
        if (userData !== null) {
          const elem = users.find((u) => u.user_id === userData.id);
          if (!elem) {
            localStorage.clear();
            setTimeout(() => {
              history.push('/');
            }, 100);
          }
        }
      });
      chan.on('new_game', ({ hands, game, user_id }) => {
        setGame(game);
        setHands(hands);
        setActivePlayer(user_id);
      });
      setChannel(chan);
    }
  };
  // eslint-disable-next-line consistent-return
  function getUnicodeCharacter(cp) {
    // eslint-disable-next-line no-mixed-operators
    if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
      return String.fromCharCode(cp);
    } if (cp >= 0x10000 && cp <= 0x10FFFF) {
      // eslint-disable-next-line no-param-reassign
      cp -= 0x10000;
      // eslint-disable-next-line no-bitwise
      const first = ((0xffc00 & cp) >> 10) + 0xD800;
      // eslint-disable-next-line no-bitwise
      const second = (0x3ff & cp) + 0xDC00;

      return String.fromCharCode(first) + String.fromCharCode(second);
    }
  }

  const generatePosition = (i) => {
    if (i === 0) {
      return 'top-3/4 left-1/4';
    }
    if (i === 1) {
      return 'top-2/4 left-1/4';
    }
    if (i === 2) {
      return 'top-1/4 left-1/4';
    }
    if (i === 3) {
      return 'top-1/4 left-2/4 -translate-x-1/2';
    }
    if (i === 4) {
      return 'top-1/4 left-3/4 -translate-x-full';
    }
    if (i === 5) {
      return 'top-2/4 left-3/4 -translate-x-full';
    }
    if (i === 6) {
      return 'top-3/4 left-3/4 -translate-x-full';
    }
    if (i === 7) {
      return 'top-3/4 left-2/4 -translate-x-1/2';
    }
    return '';
  };

  const transformCardToUnicode = (card) => {
    if (card === '??') {
      return getUnicodeCharacter(0x1F0A0);
    }
    const suitObj = {
      S: 'A',
      H: 'B',
      D: 'C',
      C: 'D',
    };
    const numObj = {
      A: 1,
      10: 'A',
      J: 'B',
      Q: 'D',
      K: 'E',
    };
    const base = `0x1F0${suitObj[card[0]]}${
      numObj[card.substring(1, card.length)]
        ? numObj[card.substring(1, card.length)]
        : card.substring(1, card.length)}`;

    return getUnicodeCharacter(base);
  };
  useEffect(() => {
    joinRoom();
  }, []);
  return (
    <div className="relative border-4 h-screen">
      <div className="absolute left-2/4 bottom-2/4 transform translate-y-1/2 -translate-x-1/2">
        <div>
          <div className="flex">
            <p className={`mx-3 text-8xl ${!game.card1 || (game.card1 && ['H', 'D'].includes(game.card1[0])) ? 'text-red-600' : 'text-gray-800'}`}>
              {game.card1 ? transformCardToUnicode(game.card1) : transformCardToUnicode('??') }
            </p>
            {' '}
            <p className={`mx-3 text-8xl ${!game.card2 || (game.card2 && ['H', 'D'].includes(game.card2[0])) ? 'text-red-600' : 'text-gray-800'}`}>
              {game.card2 ? transformCardToUnicode(game.card2) : transformCardToUnicode('??') }
            </p>
            {' '}
            <p className={`mx-3 text-8xl ${!game.card3 || (game.card3 && ['H', 'D'].includes(game.card3[0])) ? 'text-red-600' : 'text-gray-800'}`}>
              {game.card3 ? transformCardToUnicode(game.card3) : transformCardToUnicode('??') }
            </p>
            {' '}
            <p className={`mx-3 text-8xl ${!game.card4 || (game.card4 && ['H', 'D'].includes(game.card4[0])) ? 'text-red-600' : 'text-gray-800'}`}>
              {game.card4 ? transformCardToUnicode(game.card4) : transformCardToUnicode('??') }
            </p>
            {' '}
            <p className={`mx-3 text-8xl ${!game.card5 || (game.card5 && ['H', 'D'].includes(game.card5[0])) ? 'text-red-600' : 'text-gray-800'}`}>
              {game.card5 ? transformCardToUnicode(game.card5) : transformCardToUnicode('??') }
            </p>
          </div>
          <div className="flex border-2 mt-4">
            <p className="mx-4">Pot Size:</p>
            <p className="mx-2">{game.pot_size || 0}</p>
          </div>
        </div>
      </div>
      <div className="">
        { hands.map((h, i) => (
          <div className={`absolute flex flex-col m-3  transform -translate-y-1/2 ${generatePosition(i)}`} key={h.user_id}>
            <div className="flex">
              <p className={`mx-3 text-8xl ${!h.card1 || (h.card1 && ['H', 'D'].includes(h.card1[0])) ? 'text-red-600' : 'text-gray-800'}`}>
                {h.card1 ? transformCardToUnicode(h.card1) : transformCardToUnicode('??')}
              </p>
              <p className={`mx-3 text-8xl ${!h.card2 || (h.card2 && ['H', 'D'].includes(h.card2[0])) ? 'text-red-600' : 'text-gray-800'}`}>
                {h.card2 ? transformCardToUnicode(h.card2) : transformCardToUnicode('??')}
              </p>
            </div>
            <div className="mx-3">
              <p className={activePlayer !== h.user_id ? 'text-gray-200' : 'text-gray-900'}>
                {' '}
                {h.name}
                {' '}
                {h.cash}
              </p>
              <p>{h.amount_bet_this_round}</p>
            </div>

          </div>
        ))}
      </div>
      <SelectionButtons
        gameId={game.id}
        userData={userData}
        activePlayer={activePlayer}
        channel={channel}
        hands={hands}
      />
      <EventStream events={events} />
    </div>
  );
};

export default Table;
