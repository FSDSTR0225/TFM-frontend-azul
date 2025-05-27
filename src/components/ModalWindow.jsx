import Select from "react-select";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/ModalWindow.css";
const ModalWindow = ({ isOpen, type, onClose, onSuccess }) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { token } = useContext(AuthContext);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#141C3A", // scuro
      borderColor: state.isFocused ? "#00ffff" : "#3a4a7f",
      boxShadow: state.isFocused ? "0 0 5px #00ffff" : "none",
      borderRadius: "12px",
      color: "#fff",
      padding: "2px 4px",
      "&:hover": {
        borderColor: "#00ffff",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1B2455", // sfondo dropdown
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,255,255,0.15)",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#00ffff22" : "transparent",
      color: "#fff",
      cursor: "pointer",
      padding: "10px 15px",
      fontWeight: state.isSelected ? "bold" : "normal",
      transition: "background 0.2s",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#00ffff",
      fontWeight: "500",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888",
      fontStyle: "italic",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#00ffff" : "#ccc",
      "&:hover": {
        color: "#00ffff",
      },
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
  };

  useEffect(() => {
    if (type !== "platform") return;
    const fetchPlatforms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${url}/platforms`);
        const data = await res.json();
        setOptions(data.platforms);
      } catch (error) {
        console.error("Error en el fetch de las plataformas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlatforms();
  }, [isOpen, type, url]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 0) {
        setLoading(true);
        switch (type) {
          case "game":
            fetch(`${url}/search/games?query=${query}`)
              .then((res) => res.json())
              .then((data) => {
                setOptions(data.games || []);
                setLoading(false);
              })
              .catch(() => setLoading(false));
            break;

          case "friend":
            fetch(`${url}/search/users?query=${query}`)
              .then((res) => res.json())
              .then((data) => {
                setOptions(data.users || []);
                setLoading(false);
              })
              .catch(() => setLoading(false));
            break;
        }
      } else {
        setOptions([]);
      }
    }, 300); // debounce
    return () => clearTimeout(delayDebounce);
  }, [query, type, url]);

  const handleAdd = () => {
    if (!selectedOptions) return;
    const selectedId = selectedOptions.map((opt) => opt.value);

    console.log("Token:", token);
    switch (type) {
      case "game":
        fetch(`${url}/profile/favoriteGames`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ gameIds: [selectedId] }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Gioco aggiunto:", data);
            onSuccess();
            onClose();
          })
          .catch((err) => console.error("Errore gioco:", err));
        break;

      case "friend":
        fetch(`${url}/profile/friends`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ friendIds: [selectedId] }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Amico aggiunto:", data);
            onSuccess();
            onClose();
          })
          .catch((err) => console.error("Errore amico:", err));
        break;

      case "platform":
        fetch(`${url}/profile/platforms/${selectedId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ platformsId: [selectedId] }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Piattaforma aggiunta:", data);
            onSuccess();
            onClose();
          })
          .catch((err) => console.error("Errore piattaforma:", err));
        break;

      default:
        console.warn("Tipo non riconosciuto:", type);
    }
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        {type === "game" && <h2>Añade juegos</h2>}
        {type === "platform" && <h2>Añade plataformas</h2>}
        {type === "friend" && <h2>Añade amigos</h2>}
        {type === "game" && (
          <input
            type="text"
            placeholder="Buscar juego"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}

        {type === "friend" && (
          <input
            type="text"
            placeholder="Buscar amigo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}

        <Select
          isMulti
          options={options.map((option) => ({
            value: option._id,
            label: option.name,
          }))}
          value={selectedOptions}
          onChange={(options) => setSelectedOptions(options)}
          styles={customStyles}
        ></Select>
        <button className="add-button" onClick={handleAdd}>
          Añadir
        </button>
      </div>
    </div>
  );
};

export default ModalWindow;
