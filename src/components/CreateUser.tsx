import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const CreateUser = ({ setUserData }) => {
  const [name, setName] = useState('');
  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data: { user, token } } = await axiosInstance.post('/user', { name });
    localStorage.setItem('token', token);
    setName('');
    return user;
  };
  return (
    <div className="h-screen">
      <div className="left-2/4 top-2/4 fixed transform
  -translate-y-1/2 -translate-x-1/2 border border-black w-3/12"
      >
        <form
          className="flex flex-col text-center items-center"
          onSubmit={async (e) => {
            const user = await createUser(e);
            setUserData(user);
          }}
        >
          <span>Create a user to play!</span>
          <label htmlFor="name">
            <span>Name: </span>
            <input name="name" className="rounded border border-black" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <button
            type="submit"
            className="m-2 w-3/12 border-2 border-purple-500 hover:border-gray-500"
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateUser;
