/* eslint-disable camelcase */
import React from 'react';
import { PokerEvent } from './Table';

function EventStream({
  events,
}) {
  const eventParser = (e: PokerEvent): string => {
    if (e.type === 'fold') {
      return `${e.name} has folded`;
    }
    if (e.type === 'call') {
      if (e.amt === 0) {
        return `${e.name} has checked`;
      }
      return `${e.name} has called ${e.amt}`;
    }
    return 'Error with Event';
  };
  return (
    <div className="border-2 absolute top-2/4 left-24 w-2/12">
      <div className="underline">
        <p>Events!</p>
      </div>
      { events.map((e) => <p key={Math.random()}>{eventParser(e)}</p>)}
    </div>
  );
}

export default EventStream;
