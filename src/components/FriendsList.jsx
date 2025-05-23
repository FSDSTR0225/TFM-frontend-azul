import React from "react";
import "../style/Profile2.css";

const FriendsList = ({ friends }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3>Amigos</h3>
        <button className="add-button">➕ add</button>
      </div>
      <div className="circle-list">
        {friends.map((friend, index) => (
          <div className="circle blue" key={index}>
           
          <img src={friend.avatar} alt={friend.username}></img>
          </div>

        ))}
        <p>{friends?friends.map((friend) => friend.username):""}</p>
      </div>
    </div>
  );
};

export default FriendsList;
