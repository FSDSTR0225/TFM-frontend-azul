import React from "react";
import "../style/Profile2.css";

import ModalWindow from "./ModalWindow";
import { useState } from "react";
const FriendsList = ({ friends , triggerRefresh}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="section">
      <div className="section-header">
        <h3>Amigos</h3>
        <button className="add-button-p" onClick={() => setModalOpen(true)}>➕ add</button>
      </div>
      <div className="circle-list">
        {friends.map((friend, index) => (
          <div className="circle blue" key={index}>
           
          <img src={friend.avatar} alt={friend.username}></img>
          </div>

        ))}
        <p>{friends?friends.map((friend) => friend.username):""}</p>
      </div>
      <ModalWindow onSuccess={triggerRefresh} isOpen={modalOpen} onClose={() => setModalOpen(false)} type="friend"/>
    </div>
  );
};

export default FriendsList;
