import { React, useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "sonner";
import { ConfirmFriendRequestModal } from "./ConfirmFriendRequestModal";
import { PacmanLoader } from "react-spinners";
import "../style/ExploreUsers.css";

const API_URL = import.meta.env.VITE_API_URL;

function ExploreUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/search/users?query=${query}`);
        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const fetchRequests = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, fetchRequests]);

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando búsqueda...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  {
    users.map((users) => {
      console.log("USERS COMPLETOS:", users);
    });
  }

  return (
    <>
      <div className="explore-back-users"></div>
      <section className="explore-users-page-container">
        <div className="explore-users-page">
          <h2>
            Usuarios encontrados por:{" "}
            <span className="query-explore-users">"{query}"</span>
          </h2>
        </div>
        <div className="users-explore-grid">
          {users.map((user) => {
            const isFriend = user.friends?.some(
              (friend) => friend.user?._id === user._id
            );

            const hasPendingRequest =
              sentRequests.some((req) => req.userReceiver?._id === user._id) ||
              receivedRequests.some((req) => req.userSender?._id === user._id);

            return (
              <div key={user._id} className="player-card">
                <div className="player-avatar-container">
                  <img
                    loading="lazy"
                    src={
                      user.avatar && user.avatar.trim() !== ""
                        ? user.avatar
                        : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                    }
                    alt={user.username}
                    className="player-avatar"
                  />
                </div>
                <h3 className="username-mock-list">{user.username}</h3>

                <div className="player-games">
                  {user.favoriteGames?.map((game, index) => (
                    <span key={index} className="game-tag">
                      {game.name}
                    </span>
                  ))}
                </div>

                <div className="player-actions">
                  {isFriend ? (
                    <span className="friend-status">Ya sois amigos</span>
                  ) : hasPendingRequest ? (
                    <span className="friend-status">Solicitud pendiente</span>
                  ) : (
                    <button
                      className="player-button-connect"
                      onClick={() => {
                        setSelectedPlayer(user);
                        setModalOpen(true);
                      }}
                    >
                      Conectar
                    </button>
                  )}

                  <button
                    className="player-button"
                    onClick={() =>
                      navigate(`/profile/${user.username}`, {
                        state: { player: user },
                      })
                    }
                  >
                    Ver perfil
                  </button>
                </div>
              </div>
            );
          })}

          {modalOpen && selectedPlayer && (
            <ConfirmFriendRequestModal
              player={selectedPlayer}
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSuccess={async () => {
                setModalOpen(false);
                toast.success("Solicitud de amistad enviada", {
                  className: "mi-toast",
                  icon: "📩",
                });
                await fetchRequests();
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}
export default ExploreUsers;
