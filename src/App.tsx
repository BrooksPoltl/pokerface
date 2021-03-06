import React, { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import {
  BrowserRouter as Router, Switch, Route, NavLink,
} from 'react-router-dom';
import axiosInstance from './axiosInstance';
import CreateUser from './components/CreateUser';
import ShowRooms from './components/ShowRooms';
import Table from './components/Table';

type User = {
  id: number
  name: string
  cash: number
}
export const UserDataContext = React.createContext({ id: null, name: null, cash: 0 });
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
    <UserDataContext.Provider value={userData}>

      <Router>
        <NavLink strict to="/">
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              setUserData(null);
            }}
          >
            signout
          </button>
        </NavLink>
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
    </UserDataContext.Provider>
  );
};

export default App;
