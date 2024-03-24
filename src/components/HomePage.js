import React from "react";

const Home = ({ user }) => {
  return (
    <div className="text-black">
      <h1>Welcome, {user.firstName}&nbsp;{user.lastName}</h1>
      <p>Email: {user.email}</p>
      <p>Address: {user.address}</p>
      <p>Phone Number: {user.phoneNumber}</p>
    </div>
  );
};

export default Home;
