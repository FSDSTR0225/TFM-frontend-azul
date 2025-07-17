import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/Profile2.css";
import Sidebar from "../components/SideBar";
import FriendsList from "../components/FriendsList";
import { useNavigate } from "react-router-dom";
import "../style/FriendsProfile.css";

const FriendsProfile = () => {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  // Lista de amigos
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetch(`${url}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFriends(data.user?.friends || []);
        })
        .catch((err) => console.error("Errore nel recupero amici:", err));
    }
  }, [isLoggedIn, token, navigate, refreshKey, url]);

  // Solicitudes de amistad recibidas
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetch(`${url}/friends/requests/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setFriendRequestsReceived(data))
        .catch((err) => console.error("Errore nel recupero amici:", err));
    }
  }, [isLoggedIn, token, navigate, url, refreshKey]);
  // Solicitudes de amistad enviadas
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetch(`${url}/friends/requests/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setFriendRequestsSent(data))
        .catch((err) => console.error("Errore nel recupero solicitudes:", err));
    }
  }, [isLoggedIn, token, navigate, url, refreshKey]);

  // Aceptar solicitud de amistad
  const acceptFriendRequest = (requestId) => {
    fetch(`${url}/friends/requests/${requestId}/accept`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setFriendRequestsReceived((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
        triggerRefresh();
      })
      .catch((err) => console.error("Error al aceptar solicitud:", err));
  };
  // Rechazar solicitud de amistad
  const rejectFriendRequest = (requestId) => {
    fetch(`${url}/friends/requests/${requestId}/reject`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setFriendRequestsReceived((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
        triggerRefresh(); // Aquí podrías actualizar la lista de amigos si es necesario
      })
      .catch((err) => console.error("Error al rechazar solicitud:", err));
  };
  const deleteFriendRequest = (requestId) => {
    fetch(`${url}/friends/requests/${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setFriendRequestsSent((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
        // Aquí podrías actualizar la lista de amigos si es necesario
      })
      .catch((err) => console.error("Error al eliminar solicitud:", err));
  };

  return (
    <div className="friends-profile">
      <Sidebar />
      <div className="friends-profile-content">
        <FriendsList friends={friends} triggerRefresh={triggerRefresh} />
        <div className="friend-requests received">
          <h3>Solicitudes de amistad recibidas</h3>
          {friendRequestsReceived.length > 0 ? (
            friendRequestsReceived.map((request) => (
              <div key={request._id} className="friend-request">
                <img
                  src={request.userSender.avatar}
                  alt={request.userSender.username}
                />
                <p>{request.userSender.username}</p>
                <p>{request.message}</p>
                <button
                  onClick={() => {
                    acceptFriendRequest(request._id);
                  }}
                >
                  Aceptar
                </button>
                <button
                  onClick={() => {
                    rejectFriendRequest(request._id);
                  }}
                >
                  Rechazar
                </button>
              </div>
            ))
          ) : (
            <p className="no-friend-requests">
              No tienes solicitudes de amistad.
            </p>
          )}
        </div>
        <div className="friend-requests sent">
          <h3>Solicitudes de amistad enviadas</h3>
          {friendRequestsSent.length > 0 ? (
            friendRequestsSent.map((request) => (
              <div key={request._id} className="friend-request">
                <img
                  src={request.userReceiver?.avatar}
                  alt={request.userReceiver?.username}
                />
                <p>{request.userReceiver?.username}</p>
                <p>{request.message}</p>
                <button
                  onClick={() => {
                    deleteFriendRequest(request._id);
                  }}
                >
                  Cancelar solicitud
                </button>
              </div>
            ))
          ) : (
            <p className="no-friend-requests">
              No has enviado solicitudes de amistad.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default FriendsProfile;
