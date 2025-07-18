import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import "../style/CreateEventModal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  indicatorSeparator: () => ({
    display: "none",
  }),
  input: (provided) => ({
    ...provided,
    color: "#fff",
  }),
};
function CreateEventModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null, // importante: null, no string
    game: "",
    platform: null,
    maxParticipants: "",
    requiresApproval: false,
  });

  const [error, setError] = useState("");
  const [gameQuery, setGameQuery] = useState("");
  const [gameSuggestions, setGameSuggestions] = useState([]);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameSelected, setGameSelected] = useState(false);

  useEffect(() => {
    if (!gameSelected || gameQuery.length < 2) {
      setGameSuggestions([]);
      return;
    }

    const fetchGames = async () => {
      try {
        const res = await fetch(`${API_URL}/search/games?query=${gameQuery}`);

        if (!res.ok) {
          throw new Error("No se pudieron obtener los juegos");
        }
        const data = await res.json();
        setGameSuggestions(data.games);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error buscando juegos:", err);
        setGameSuggestions([]); // Evita que se quede en null
        setShowSuggestions(false);
      }
    };

    fetchGames();
  }, [gameQuery, gameSelected]);

  const handleGameSelect = async (game) => {
    setFormData((prev) => ({ ...prev, game: game._id, platform: null }));
    setGameQuery(game.name);
    setGameSelected(false);
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
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
      platform: formData.platform.value,
      maxParticipants:
        formData.maxParticipants === ""
          ? null
          : Number(formData.maxParticipants),
    };
    onCreate(finalData);
    onClose();
  };

  const preventCloseRef = useRef(false);

  const now = new Date();
  //hoy =  si hay fecha seleccionada,la convertimos a string y la comparamos con la fecha actual, si son iguales,es hoy(true)

  const isToday =
    formData.date &&
    new Date(formData.date).toDateString() === now.toDateString();

  //minima hora seleccionable,si es hoy = hora actual,sino hasta las 00:00h
  const minTime = isToday ? now : new Date().setHours(0, 0, 0, 0);

  return (
    <div className="modal-overlay-events">
      <div className="modal-event-content create-event-modal">
        <span className="close-edit-btn" onClick={onClose} title="Cerrar">
          ✖
        </span>
        <h2>Crear nuevo evento</h2>

        {error && <p className="error-message">{error}</p>}

        <form className="event-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="title"
            placeholder="Título del evento"
            maxLength={20}
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
            minDate={now}
            minTime={new Date(minTime)}
            maxTime={new Date().setHours(23, 59, 59, 999)} // hasta las 23:59:59
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Juego..."
              value={gameQuery}
              onChange={(e) => {
                setGameQuery(e.target.value);
                setGameSelected(true);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (gameSuggestions.length > 0) setShowSuggestions(true);
              }}
              // para evitar que se cierre el dropdown al hacer click en un item,onBlur sirve para detectar cuando el input pierde el foco
              onBlur={() => {
                setTimeout(() => {
                  if (!preventCloseRef.current) {
                    // si no se ha hecho click en un item, cerramos las sugerencias

                    setShowSuggestions(false);
                  }
                  preventCloseRef.current = false; // reseteamos el valor de referencia
                }, 100);
              }}
              autoComplete="off"
              required
            />
            {gameSuggestions.length > 0 && showSuggestions && (
              <ul className="autocomplete-list">
                {gameSuggestions.map((game) => (
                  <li
                    key={game._id}
                    onMouseDown={() => {
                      preventCloseRef.current = true;
                      handleGameSelect(game);
                    }}
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
            placeholder="Máximo de participantes, 0 para sin límite"
            value={formData.maxParticipants}
            onChange={handleChange}
            min={0}
            max={10}
            pattern="[0-9]*" // Pas solo números
            title="Máximo de participantes, 0 para sin límite"
          />

          <label className="checkbox-label">
            <input
              title="Marca si el evento es privado"
              type="checkbox"
              name="requiresApproval"
              checked={formData.requiresApproval}
              onChange={handleChange}
            />
            ¿Privado? Tú decides quién puede unirse.
          </label>

          <button type="submit" className="submit-button">
            Crear evento
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEventModal;
