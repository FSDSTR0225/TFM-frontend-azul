import { React, useState, useEffect, useContext } from "react";
import GridLayout from "react-grid-layout";
import AuthContext from "../context/AuthContext";
import "../style/WidgetSystem.css";
import FriendsOnlineWidget from "./FriendsOnlineWidget";
import EventCalendarWidget from "./EventCalendarWidget";

const API_URL = import.meta.env.VITE_API_URL;

const widgetComponents = {
  friends: <FriendsOnlineWidget />,
  calendar: <EventCalendarWidget />,
};

function WidgetSystem() {
  const [widgetList, setWidgetList] = useState([]); // Estado para almacenar los widgets

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchWidgets = async () => {
      const res = await fetch(`${API_URL}/dashboard/widgets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWidgetList(data.widgets); // asumimos que viene un array
    };
    fetchWidgets();
  }, [token]);

  const layout = widgetList.map((widget, index) => ({
    i: widget._id,
    x: widget.x ?? (index * 2) % 12,
    y: widget.y ?? Math.floor(index / 6),
    w: widget.w ?? 3,
    h: widget.h ?? 2,
    minW: 2,
    maxW: 12,
    minH: 2,
    maxH: 10,
    static: false,
  }));

  // esta función se llama cuando se cambia la disposición de los widgets y actualiza la posición y tamaño de cada widget en el backend al soltar el widget en la nueva posición
  const handleLayoutChange = async (newLayout) => {
    const updates = newLayout.map((item) => ({
      id: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }));

    try {
      const res = await fetch(`${API_URL}/dashboard/widgets/multi-update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.ok) {
        setWidgetList(data.widgets); // opcional: actualiza el estado
      } else {
        console.error("Error al actualizar widgets:", data.message);
      }
    } catch (error) {
      console.error("Error en multi-update:", error);
    }
  };

  const handleAddFriendsWidget = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/widgets/friends`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setWidgetList(data.widgets); // Actualiza el listado con lo nuevo
      } else {
        console.error("Error al añadir widget:", data.message);
      }
    } catch (error) {
      console.error("Error al añadir widget:", error);
    }
  };

  return (
    <div className="widget-system">
      <button className="add-widget-btn" onClick={handleAddFriendsWidget}>
        + Añadir widget de amigos
      </button>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={150}
        width={1200}
        autoSize={true}
        preventCollision={true}
        compactType={null}
        isBounded={true}
        isDraggable={true}
        isResizable={true}
        resizeHandles={["se"]} // Permite redimensionar los widgets desde la esquina marcada
        // onResize={(layout, oldItem, newItem) => {
        //   console.log("Resizing", newItem);
        // }}
        onLayoutChange={handleLayoutChange}
      >
        {widgetList.map((widget) => (
          <div key={widget._id} className="widget-box">
            {widgetComponents[widget.type]}
          </div>
        ))}
      </GridLayout>
    </div>
  );
}

export default WidgetSystem;

// import { React, useState, useEffect, useContext } from "react";
// import GridLayout from "react-grid-layout";
// import AuthContext from "../context/AuthContext";
// import "../style/WidgetSystem.css";
// import FriendsOnlineWidget from "./FriendsOnlineWidget";
// import EventCalendarWidget from "./EventCalendarWidget";

// const API_URL = import.meta.env.VITE_API_URL;

// const widgetComponents = {
//   friends: <FriendsOnlineWidget />,
//   calendar: <EventCalendarWidget />,
// };

// function WidgetSystem() {
//   const [widgetList, setWidgetList] = useState([]); // Estado para almacenar los widgets
//   const [layout, setLayout] = useState([]); // Estado para almacenar la disposición de los widgets

//   const { token } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchWidgets = async () => {
//       const res = await fetch(`${API_URL}/dashboard/widgets`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setWidgetList(data.widgets); // asumimos que viene un array

//       // Genera el layout inicial desde los datos del backend
//       const newLayout = data.widgets.map((widget, index) => ({
//         i: widget._id,
//         x: widget.x ?? (index * 2) % 12,
//         y: widget.y ?? Math.floor(index / 6),
//         w: widget.w ?? 3,
//         h: widget.h ?? 2,
//         minW: 2,
//         maxW: 12,
//         minH: 2,
//         maxH: 10,
//         static: false,
//       }));
//       setLayout(newLayout);
//     };
//     fetchWidgets();
//   }, [token]);

//   // esta función se llama cuando se cambia la disposición de los widgets y actualiza la posición y tamaño de cada widget en el backend al soltar el widget en la nueva posición
//   const handleLayoutChange = async (newLayout) => {
//     setLayout(newLayout); // Actualiza el layout local en tiempo real

//     const updates = newLayout.map((item) => ({
//       id: item.i,
//       x: item.x,
//       y: item.y,
//       w: item.w,
//       h: item.h,
//     }));

//     try {
//       const res = await fetch(`${API_URL}/dashboard/widgets/multi-update`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updates),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setWidgetList(data.widgets); // opcional: actualiza el estado
//       } else {
//         console.error("Error al actualizar widgets:", data.message);
//       }
//     } catch (error) {
//       console.error("Error en multi-update:", error);
//     }
//   };

//   const handleAddFriendsWidget = async () => {
//     try {
//       const res = await fetch(`${API_URL}/dashboard/widgets/friends`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setWidgetList(data.widgets); // Actualiza el listado con lo nuevo

//         // También actualiza el layout con el nuevo widget añadido
//         const updatedLayout = data.widgets.map((widget, index) => ({
//           i: widget._id,
//           x: widget.x ?? (index * 2) % 12,
//           y: widget.y ?? Math.floor(index / 6),
//           w: widget.w ?? 3,
//           h: widget.h ?? 2,
//           minW: 2,
//           maxW: 12,
//           minH: 2,
//           maxH: 10,
//           static: false,
//         }));
//         setLayout(updatedLayout);
//       } else {
//         console.error("Error al añadir widget:", data.message);
//       }
//     } catch (error) {
//       console.error("Error al añadir widget:", error);
//     }
//   };

//   return (
//     <div className="widget-system">
//       <button className="add-widget-btn" onClick={handleAddFriendsWidget}>
//         + Añadir widget de amigos
//       </button>
//       <GridLayout
//         className="layout"
//         layout={layout}
//         cols={12}
//         rowHeight={150}
//         width={1200}
//         autoSize={true}
//         preventCollision={true}
//         compactType={null}
//         isBounded={true}
//         isDraggable={true}
//         isResizable={true}
//         resizeHandles={["se", "s", "e"]} // Permite redimensionar los widgets desde la esquina sureste, sur y este
//         onResize={(layout, oldItem, newItem) => {
//           console.log("Resizing", newItem);
//         }}
//         onLayoutChange={handleLayoutChange}
//       >
//         {widgetList.map((widget) => (
//           <div key={widget._id} className="widget-box">
//             {widgetComponents[widget.type]}
//           </div>
//         ))}
//       </GridLayout>
//     </div>
//   );
// }

// export default WidgetSystem;
