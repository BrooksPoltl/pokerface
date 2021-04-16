import React, { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import CreateUser from './components/CreateUser';
import ShowRooms from './components/ShowRooms';
import Table from './components/Table';

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
    <Router>
      <Switch>
        <Route path="/tables/:roomId">
          <Table />
        </Route>
        <Route path="/">
          {!userData
            ? <CreateUser setUserData={setUserData} />
            : <ShowRooms />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
