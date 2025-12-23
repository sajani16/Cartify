import React from "react";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";

function Home() {
  const { name } = useSelector((state) => state.user);

  return (
    <div>
      Home Page
      {<h1>{name}</h1>}
      <Dashboard />
    </div>
  );
}

export default Home;
