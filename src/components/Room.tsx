import React from 'react';
import { Link } from 'react-router-dom';

function Room({ room }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {room.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{room.username}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {room.count}
          /8
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {room.count >= 8
          ? <span className="text-gray-500">Join</span>
          : <Link to={`/tables/${room.id}`} className="text-indigo-600 hover:text-indigo-900" disabled={room.count >= 8}>Join</Link>}
      </td>
    </tr>
  );
}

export default Room;
