import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance'

type User = {
  id: number
  name: string
  cash: number
}
const App = () => {
  const [name, setName] = useState("");
  const [user, setUser ] = useState<User | null>(null);

  useEffect(() => {
    axiosInstance.interceptors.request.use(function (config) {
      const token = localStorage.getItem('token');
      config.headers.Authorization =  token ? `Bearer ${token}` : '';
      return config;
    });
    
  },[])

  const fetchUser = async(cred = false) => {
    await axiosInstance.get("/")
  }

  const createUser = async(event: React.FormEvent) => {
    event.preventDefault();
    const { data: {user, token }} = await axiosInstance.post("/", { name })
    console.log(user)
    setUser(user)
    localStorage.setItem('token', token);
    setName("");
  }

   return  !user? (
      <div className="border border-red h-screen">  
  <div className="left-2/4 top-2/4 fixed transform -translate-y-1/2 -translate-x-1/2 border border-black w-3/12">
    <form className = "flex flex-col text-center items-center" onSubmit={createUser}>
      <span>Create a user to play!</span>
      <label>
        Name: 
      <input className="rounded border border-black" type="text" value={name} onChange={e => setName(e.target.value)}></input>
      </label>
    <button className="m-2 w-3/12 border-2 border-purple-500 hover:border-gray-500">submit</button>
    </form>
  </div>
  </div>
    ):
    <div>
      {user!.id}
    </div> 
}

export default App;
