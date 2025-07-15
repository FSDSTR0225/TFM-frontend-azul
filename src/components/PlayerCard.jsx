import { useState, useEffect, useContext, useCallback } from "react";
import "../style/PlayerCard.css";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ConfirmFriendRequestModal } from "./ConfirmFriendRequestModal";
import "../style/ModalWindow.css";
import blankImg from "../assets/blankImg.jpg";
import { toast } from "sonner";
const PlayerCard = ({ player }) => {
  const { user, token } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false); // setModalOpen
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);
      const fetchRequests = useCallback( async () => {
      try {
        const [sentRes, receivedRes] = await Promise.all([
          fetch(`${API_URL}/friends/requests/sent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/friends/requests/received`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sentData = await sentRes.json();
        const receivedData = await receivedRes.json();

        setSentRequests(sentData || []);
        setReceivedRequests(receivedData || []);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    }, [token, API_URL]);

useEffect(() => {
  if (token) {
    fetchRequests();
  }
}, [token, fetchRequests]); // ora NON causa loop infinito

  const isFriend = player.friends?.some(
    (friend) => friend.user._id === user._id
  );

  // Verifica se c'è una richiesta inviata o ricevuta
  const hasPendingRequest =
    sentRequests.some((req) => req.userReceiver?._id === player._id) ||
    receivedRequests.some((req) => req.userSender?._id === player._id);
  return (
    <div className="player-card" key={player._id}>
      <div className="player-avatar-container">
        <img
          src={player.avatar || blankImg}
          alt={player.username}
          className="player-avatar"
        />
      </div>
      <h3 className="username-mock-list">{player.username}</h3>
      <div className="player-games">
        {player.favoriteGames?.map((game, index) => (
          <span key={index} className="game-tag">
            {game.name}
          </span>
        ))}
      </div>
      <div className="player-actions">
        {isFriend ? (
          <span className="friend-status">Ya son amigos</span>
        ) : hasPendingRequest ? (
          <span className="friend-status">Solicitud pendiente</span>
        ) : (
          <button onClick={() => setModalOpen(true)} className="player-button">
            Añadir a amigos
          </button>
        )}

        <Link
          to={`/profile/${player.username}`}
          state={{ player }}
          className="player-button"
        >
          Ver perfil
        </Link>
      </div>

      {modalOpen && (
        <ConfirmFriendRequestModal
          player={player}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={async() => {
            setModalOpen(false);
            toast.success("Solicitud de amistad enviada",{className: 'mi-toast', icon: '📩'});
            await fetchRequests();
          }}
        />
      )}
    </div>
  );
};

export default PlayerCard;
