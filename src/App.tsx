import React, { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

type User = {
  id: number
  name: string
  cash: number
}
const App = () => {
  const [name, setName] = useState('');
  const [userData, setUserData] = useState<User | null>(null);
  const fetchUser = async () => {
    await axiosInstance.get('/');
  };

  useEffect(() => {
    axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      const conf = config;
      conf.headers.Authorization = token ? `Bearer ${token}` : '';
      return conf;
    });
    fetchUser();
  }, []);

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data: { user, token } } = await axiosInstance.post('/', { name });
    console.log(user);
    setUserData(user);
    localStorage.setItem('token', token);
    setName('');
  };

  return !userData ? (
    <div className="border border-red h-screen">
      <div className="left-2/4 top-2/4 fixed transform
      -translate-y-1/2 -translate-x-1/2 border border-black w-3/12"
      >
        <form className="flex flex-col text-center items-center" onSubmit={createUser}>
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
  )
    : (
      <div>
        {userData!.id}
      </div>
    );
};

export default App;
