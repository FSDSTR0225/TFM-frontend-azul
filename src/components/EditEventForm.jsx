import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import AuthContext from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../style/CreateEventModal.css";

const API_URL = import.meta.env.VITE_API_URL;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "#23243a",
    borderColor: state.isFocused ? "#00ffc8" : "#2e2e4d",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(0,255,200,0.12)" : "none",
    color: "#fff",
    minHeight: "48px",
    borderRadius: "9px",
    fontSize: "1rem",
    fontWeight: 500,
  }),
  menu: (provided) => ({
    ...provided,
    background: "#181a2a",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0,255,255,0.13)",
    border: "1.5px solid #00ffc8",
    color: "#fff",
    zIndex: 20,
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected
      ? "#00ffc8"
      : state.isFocused
      ? "#1f2739"
      : "#181a2a",
    color: state.isSelected ? "#181a2a" : "#fff",
    fontWeight: state.isSelected ? 700 : 500,
    cursor: "pointer",
    fontSize: "1rem",
    padding: "12px 16px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
    fontWeight: 500,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#aaa",
    fontWeight: 400,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#00ffc8" : "#aaa",
    "&:hover": { color: "#00ffc8" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  input: (provided) => ({
    ...provided,
    color: "#fff",
  }),
};

function EditEventForm({ event, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    date: new Date(event.date),
    game: event.game._id || event.game,
    platform: {
      value: event.platform._id || event.platform,
      label: event.platform.name,
    },
    maxParticipants: event.maxParticipants || "",
    requiresApproval: event.requiresApproval || false,
  });

  const [gameQuery, setGameQuery] = useState("");
  const [gameSuggestions, setGameSuggestions] = useState([]);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [isEditingGame, setIsEditingGame] = useState(false);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    // Inicializar el campo de búsqueda del juego con el juego
    setGameQuery(event.game.name);
  }, [event.game.name]);

  useEffect(() => {
    if (gameQuery.length < 2 || !isEditingGame) {
      setGameSuggestions([]);
      return;
    }

    const fetchGames = async () => {
      try {
        const res = await fetch(`${API_URL}/search/games?query=${gameQuery}`);
        const data = await res.json();
        setGameSuggestions(data.games);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error buscando juegos:", err);
      }
    };

    fetchGames();
  }, [gameQuery, isEditingGame]);

  const handleGameSelect = async (game) => {
    setFormData((prev) => ({ ...prev, game: game._id, platform: null }));
    setGameQuery(game.name);
    setGameSuggestions([]);
    setShowSuggestions(false);

    try {
      const res = await fetch(`${API_URL}/games/${game._id}/platforms`);
      const data = await res.json();
      setPlatformOptions(
        data.platforms.map((plat) => ({
          value: plat._id,
          label: plat.name,
        }))
      );
    } catch (err) {
      console.error("Error al cargar plataformas:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.game ||
      !formData.platform
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const finalData = {
      ...formData,
      date: formData.date,
      game: formData.game._id || formData.game,
      platform: formData.platform.value || formData.platform,
      maxParticipants:
        formData.maxParticipants === ""
          ? null
          : Number(formData.maxParticipants),
    };

    try {
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el evento");
      }

      const updated = await res.json();

      onUpdate(updated.updatedEvent);
      onClose();
    } catch (error) {
      console.error(" Error actualizando evento:", error);
    }
  };

  return (
    <div
      className="modal-overlay-events"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay-events")) {
          onClose();
        }
      }}
    >
      <div className="modal-event-content create-event-modal">
        <span className="close-edit-btn" onClick={onClose} title="Cerrar">
          ✖
        </span>

        {error && <p className="error-message">{error}</p>}

        <form className="event-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            maxLength={30}
            type="text"
            name="title"
            placeholder="Título del evento"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            maxLength={200}
            rows={5}
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <DatePicker
            selected={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Selecciona fecha y hora"
            calendarClassName="custom-datepicker-calendar"
            popperClassName="custom-datepicker-popper"
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Juego..."
              value={gameQuery}
              onChange={(e) => {
                setGameQuery(e.target.value);
                setIsEditingGame(true);
              }}
              onFocus={() => {
                if (gameSuggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 100);
              }}
              autoComplete="off"
              required
            />
            {gameSuggestions.length > 0 && showSuggestions && (
              <ul className="autocomplete-list">
                {gameSuggestions.map((game) => (
                  <li
                    key={game._id}
                    onMouseDown={() => handleGameSelect(game)}
                    className="autocomplete-item"
                  >
                    {game.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
            options={platformOptions}
            value={formData.platform}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, platform: selected }))
            }
            placeholder="Selecciona una plataforma"
            isSearchable={false}
            menuPlacement="auto"
            required
          />

          <input
            type="number"
            name="maxParticipants"
            placeholder="Máximo de participantes (opcional)"
            value={formData.maxParticipants}
            onChange={handleChange}
            min={0}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="requiresApproval"
              checked={formData.requiresApproval}
              onChange={handleChange}
            />
            ¿Requiere aprobación?
          </label>

          <button type="submit" className="submit-button">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEventForm;
