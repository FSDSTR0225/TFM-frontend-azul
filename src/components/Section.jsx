import { React, useState } from "react";

function Section({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="panel-section">
      <div className="panel-section-header" onClick={() => setOpen((o) => !o)}>
        {icon && <span className="panel-section-icon">{icon}</span>}
        <span className="panel-section-title">{title}</span>
        <span className="panel-section-toggle">{open ? "−" : "+"}</span>
      </div>
      {open && <div className="panel-section-content">{children}</div>}
    </div>
  );
}

export default Section;
