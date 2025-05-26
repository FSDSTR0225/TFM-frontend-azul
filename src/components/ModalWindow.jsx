import React from "react";
import Select from "react-select";
import { useState, useEffect } from "react";

import "../style/Modal.css";
const ModalWindow = ({ isOpen , type, onClose}) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const url= "http://localhost:3000";
  
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
                        case "platform":
                            fetch(`${url}/platforms`)
                            .then((res) => res.json())
                            .then((data) => {
                                setOptions(data.platforms || []);
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
                }, [query, type]);
                
                const handleAdd = () =>{

                }
                if (!isOpen) {
                  return null;
                }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
            <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      {type === "game" && (
        <h2>Añade juegos</h2>
      )}
      {type === "platform" && (
        <h2>Añade plataformas</h2>
      )}
      {type === "friend" && (
        <h2>Añade amigos</h2>
      )}
      {type === "game" && (
        <input
          type="text"
          placeholder="Buscar juego"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
  {type === "platform" && (
    <input
      type="text"
      placeholder="Buscar plataforma"
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
        options={options.map((option) => ({
          value: option.id,
          label: option.name,
        }))}
      ></Select>
      <button className="add-button" onClick={handleAdd}>
Añadir</button>
      </div>
    </div>
  );
};

export default ModalWindow;
