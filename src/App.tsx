import React, { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';
import CreateUser from './components/CreateUser';
import ShowRooms from './components/ShowRooms';

type User = {
  id: number
  name: string
  cash: number
}
const App = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const fetchUser = async () => {
    const { data: user } = await axiosInstance.get('/user');
    setUserData(user);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const conf = config;
      conf.headers.Authorization = token || '';
      return conf;
    });
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <div>
      {!userData
        ? <CreateUser setUserData={setUserData} />
        : <ShowRooms />}
    </div>
  );
};

export default App;
