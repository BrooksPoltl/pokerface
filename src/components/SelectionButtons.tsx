/* eslint-disable camelcase */
import React from 'react';

function SelectionButtons({
  activePlayer, userData, channel, gameId,
}) {
  const sendEvent = (event: string, amt: number) => {
    channel.push('new_event', { body: { event, amt, gameId } })
      .receive('ok', () => {})
      .receive('error', (res) => console.log('error:', res));
  };
  return (
    <div className="border-2 absolute top-2/4 right-24 w-2/12">
      <button
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        disabled={activePlayer !== (userData && userData.id)}
        onClick={() => sendEvent('call', 0)}
      >
        Call/Check
      </button>
      <button
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        disabled={activePlayer !== (userData && userData.id)}
        onClick={() => sendEvent('fold', 0)}
      >
        Fold
      </button>
      <button
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        disabled={activePlayer !== (userData && userData.id)}
        onClick={() => sendEvent('raise', 0)}
      >
        Raise
      </button>
    </div>
  );
}

export default SelectionButtons;
