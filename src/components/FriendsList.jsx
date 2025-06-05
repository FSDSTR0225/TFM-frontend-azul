import React from "react";
import { useState, useContext } from "react";
import "../style/Profile2.css";
import ModalWindow from "./ModalWindow";
import AuthContext from "../context/AuthContext";
const FriendsList = ({ friends, triggerRefresh }) => {
  const { token } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  console.log(friends);
  const handleDelete = (id) => {
    fetch(`${url}/profile/friends/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        triggerRefresh();
      })
      .catch((err) => console.error("Errore gioco:", err));
  };
  return (
    <div className="section">
      <div className="section-header">
        <h3>Amigos</h3>
        <button className="add-button-p" onClick={() => setModalOpen(true)}>
          ➕ add
        </button>
      </div>
      <div className="circle-list">
        {friends.map((friend, index) => (
          <div className="circle-wrapper" key={index}>
            <div className="circle blue" key={index}>
              <img src={friend.user.avatar} alt={friend.user.username} className="favorite-game-img"></img>
              <button
                onClick={() => handleDelete(friend.user._id)}
                className="delete-button"
                key={friend.user._id}
                aria-label={`Eliminar ${friend.user.username}`}
              >
                X
              </button>
            </div>
            <p>{friend.user.username}</p>
          </div>
        ))}
      </div>
      <ModalWindow
        existingItems={friends}
        onSuccess={triggerRefresh}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="friend"
      />
    </div>
  );
};

export default FriendsList;
