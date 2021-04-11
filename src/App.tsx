import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [name, setName] = useState("");
  useEffect(() => {
    fetchUser();
  },[])

  const fetchUser = async() => {
    await axios.get("http://localhost:4000/api")
  }

  const createUser = async(event: React.FormEvent) => {
    event.preventDefault();
    const user = await axios.post("http://localhost:4000/api", { name })
    
    setName("");
  }

  return (  
  <div className="border border-red h-screen">  
  <div className="left-2/4 top-2/4 fixed absolute transform -translate-y-1/2 -translate-x-1/2 border border-black w-3/12">
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
  );
}

export default App;
