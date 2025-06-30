import React from "react";

function FilterEvents({
  platforms,
  selectedPlatform,
  setSelectedPlatform,
  selectedDate,
  setSelectedDate,
}) {
  const dateOptions = ["Todos", "Esta semana", "Este mes"];

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="filters-panel">
      <h2 className="filters-title">Filtros</h2>

      <div className="filter-group">
        <h3 className="filter-label">Plataforma</h3>
        {platforms.map((p) => (
          <label key={p.id} className="filter-option">
            <input
              type="radio"
              name="platform"
              value={p.name}
              checked={selectedPlatform === p.name}
              onChange={handlePlatformChange}
            />
            {p.name}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h3 className="filter-label">Fecha</h3>
        {dateOptions.map((f) => (
          <label key={f} className="filter-option">
            <input
              type="radio"
              name="date"
              value={f}
              checked={selectedDate === f}
              onChange={handleDateChange}
            />
            {f}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterEvents;
