import Select from "react-select";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/ModalWindow.css";
const ModalWindow = ({ isOpen, type, onClose, onSuccess, existingItems }) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { token } = useContext(AuthContext);
 // estilos select
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
// Fetch de las plataformas
  useEffect(() => {
    if (type !== "platform") return;
    const fetchPlatforms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${url}/platforms`);
        const data = await res.json();
        const platforms = data.platforms || [];
        const filteredResults = platforms.filter(
          (item) => !existingItems.some((fav) => fav._id === item._id)
        );
        setOptions(filteredResults);
      } catch (error) {
        console.error("Error en el fetch de las plataformas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlatforms();
  }, [isOpen, type, url]);
// Buscador de juagos y amigos
  useEffect(() => {
    if (!isOpen || (type !== "game" && type !== "friend")) return;
    const delayDebounce = setTimeout(() => {
      if (query.length > 0) {
        setLoading(true);
        let endpoint = "";
        if (type === "game") endpoint = `search/games?query=${query}`;
        if (type === "friend") endpoint = `search/users?query=${query}`;

        if (!endpoint) return;

        fetch(`${url}/${endpoint}`)
          .then((res) => res.json())
          .then((data) => {
            let results = [];

            if (type === "game") results = data.games || [];
            if (type === "friend") results = data.user.friends || [];

            const filteredResults = results.filter(
              (item) => !existingItems.some((fav) => fav._id === item._id)
            );

            setOptions(filteredResults);
          })
          .catch(() => setLoading(false))
          .finally(() => setLoading(false));
      }
    }, 300); // debounce
    return () => clearTimeout(delayDebounce);
  }, [query, type, url]);
//Añadir juegos , amigos oplataformas
  const handleAdd = () => {
    if (!selectedOptions || selectedOptions.length === 0) return;

    const selectedIds = selectedOptions.map((opt) => opt.value);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (type === "game") {
      return fetch(`${url}/profile/favoriteGames`, {
        method: "POST",
        headers,
        body: JSON.stringify({ gameIds: selectedIds }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Gioco aggiunto:", data);
          onSuccess();
          onClose();
        })
        .catch((err) => console.error("Errore gioco:", err));
    }

    if (type === "friend") {
      return fetch(`${url}/profile/friends`, {
        method: "POST",
        headers,
        body: JSON.stringify({ friendIds: selectedIds }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Amico aggiunto:", data);
          onSuccess();
          onClose();
        })
        .catch((err) => console.error("Errore amico:", err));
    }

    if (type === "platform") {
      return fetch(`${url}/profile/platforms/${selectedIds}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ platformsId: selectedIds }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Piattaforma aggiunta:", data);
          onSuccess();
          onClose();
        })
        .catch((err) => console.error("Errore piattaforma:", err));
    }

    console.warn("Tipo non riconosciuto:", type);
  };
//Todos los juegos/amigos sin query
  // useEffect(() => {
  //   if (!isOpen || type === "platform") return;

  //   setLoading(true);
  //   let endpoint = "";
  //   if (type === "game") endpoint = "games";
  //   if (type === "friend") endpoint = "users";

  //   fetch(`${url}/${endpoint}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const results =
  //         type === "game"
  //           ? data.games
  //           : type === "friend"
  //           ? data.users
  //           : [];
  //       setOptions(results);
  //     })
  //     .catch((err) => console.error("Errore iniziale:", err))
  //     .finally(() => setLoading(false));
  // }, [isOpen, type, url]);

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        {type === "game" && <h2>Añade juegos</h2>}
        {type === "platform" && <h2>Añade plataformas</h2>}
        {type === "friend" && <h2>Añade amigos</h2>}

        <Select
          isMulti
          options={options.map((option) => ({
            value: option._id,
            label: option.name,
          }))}
          value={selectedOptions}
          onChange={(options) => setSelectedOptions(options)}
          onInputChange={(inputValue) => setQuery(inputValue)}
          placeholder="Escribe para buscar..."
          isLoading={loading}
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
