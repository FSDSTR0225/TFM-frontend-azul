// import { React, useState, useEffect, useContext } from "react";
// import GridLayout from "react-grid-layout";
// import AuthContext from "../context/AuthContext";
// import "../style/WidgetSystem.css";
// import FriendsOnlineWidget from "./FriendsOnlineWidget";
// import CalendarWidget from "./CalendarWidget";
// import SuggestedUsersWidget from "./SuggestedUsersWidget";
// import SuggestedGamesWidget from "./SuggestedGamesWidget";
// import { toast } from "sonner";
// import SuggestedEventsWidget from "./SuggestedEventsWidget";

// const API_URL = import.meta.env.VITE_API_URL;

// const widgetComponents = {
//   friends: () => <FriendsOnlineWidget />, //asi podemos pasar props si las necesitamos
//   calendar: () => <CalendarWidget />,
//   userSuggestions: () => <SuggestedUsersWidget />,
//   gameSuggestions: () => <SuggestedGamesWidget />,
//   eventSuggestions: () => <SuggestedEventsWidget />,
// };

// function WidgetSystem() {
//   const [widgetList, setWidgetList] = useState([]); // Estado para almacenar los widgets
//   const [showMenu, setShowMenu] = useState(false);

//   const { token } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchWidgets = async () => {
//       const res = await fetch(`${API_URL}/dashboard/widgets`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setWidgetList(data.widgets); // asumimos que viene un array
//     };
//     fetchWidgets();
//   }, [token]);

//   const layout = widgetList.map((widget, index) => ({
//     i: widget._id,
//     x: widget.x ?? (index * 2) % 12,
//     y: widget.y ?? Math.floor(index / 6),
//     w: widget.w ?? 3,
//     h: widget.h ?? 2,
//     // minW: 1, //minW: widget.type === "calendar" ? 1 : 2, para ajustar según el tipo de widget
//     minW: widget.type === "userSuggestions" ? 2 : 1,
//     maxW: 12,
//     minH: 1,
//     maxH: 10,
//     static: false,
//   }));

//   //PARA DEBUGGING Y ADECUAR TAMAÑO DE LOS WIDGETS POR DEFECTO
//   // const layout = widgetList.map((widget, index) => {
//   //   const layoutItem = {
//   //     i: widget._id,
//   //     x: widget.x ?? (index * 2) % 12,
//   //     y: widget.y ?? Math.floor(index / 6),
//   //     w: widget.w ?? 3,
//   //     h: widget.h ?? 2,
//   //     minW: 2,
//   //     maxW: 12,
//   //     minH: 2,
//   //     maxH: 10,
//   //     static: false,
//   //   };
//   // if (widget.type === "calendar") {
//   //   console.log("Calendario:", layoutItem);
//   // }

//   //   return layoutItem;
//   // });

//   // esta función se llama cuando se cambia la disposición de los widgets y actualiza la posición y tamaño de cada widget en el backend al soltar el widget en la nueva posición
//   const handleLayoutChange = async (newLayout) => {
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
//       console.log("Widgets desde el backend:", data.widgets);

//       if (res.ok) {
//         setWidgetList(data.widgets); // opcional: actualiza el estado
//       } else {
//         console.error("Error al actualizar widgets:", data.message);
//       }
//     } catch (error) {
//       console.error("Error en multi-update:", error);
//     }
//   };

//   const handleAddWidget = async (type) => {
//     try {
//       const response = await fetch(`${API_URL}/dashboard/widgets/${type}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         if (response.status === 400 && data.message === "El widget ya existe") {
//           toast.info("Ya tienes este widget añadido.", {
//             className: "mi-toast",
//             icon: "",
//           });
//         }
//         throw new Error(data.message || "Error fetching widget");
//       }

//       setWidgetList(data.widgets);
//       setShowMenu(false);
//     } catch (error) {
//       console.error("Error al añadir widget", error);
//     }
//   };

//   const handleRemoveWidget = async (widgetId) => {
//     try {
//       const response = await fetch(`${API_URL}/dashboard/widgets/${widgetId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Error...");
//       }
//       const data = await response.json();
//       setWidgetList((prevList) => prevList.filter((w) => w._id !== widgetId));
//       setShowMenu(false);

//       toast.success(data.message || "Widget eliminado", {
//         className: "mi-toast",
//       });
//     } catch (error) {
//       console.error("Error al añadir widget", error);
//     }
//   };

//   return (
//     <div className="widget-system">
//       <div className="add-widget-container">
//         <button
//           className="add-widget-btn"
//           onClick={() => setShowMenu((prev) => !prev)}
//         >
//           ⋮ Widgets
//         </button>
//         {showMenu && (
//           <ul className="widget-menu">
//             <li onClick={() => handleAddWidget("friends")}>Amigos Online</li>
//             <li onClick={() => handleAddWidget("calendar")}>
//               Calendario de eventos
//             </li>
//             <li onClick={() => handleAddWidget("eventSuggestions")}>
//               Eventos sugeridos
//             </li>
//             <li onClick={() => handleAddWidget("gameSuggestions")}>
//               Juegos sugeridos
//             </li>
//             <li onClick={() => handleAddWidget("userSuggestions")}>
//               Usuarios sugeridos
//             </li>
//           </ul>
//         )}
//       </div>
//       <GridLayout
//         className="layout"
//         layout={layout}
//         cols={12}
//         rowHeight={150}
//         width={window.innerWidth}
//         // autoSize={true}
//         preventCollision={true}
//         compactType={null}
//         isBounded={false}
//         useCSSTransforms={true}
//         isDraggable={true}
//         isResizable={true}
//         verticalCompact={false}
//         margin={[20, 20]}
//         resizeHandles={["se"]} // Permite redimensionar los widgets desde la esquina marcada
//         // onResize={(layout, oldItem, newItem) => {
//         //   console.log("Resizing", newItem);
//         // }}
//         onLayoutChange={handleLayoutChange}
//       >
//         {widgetList.map((widget) => (
//           <div key={widget._id} className="widget-box">
//             <span
//               className="delete-widget-button"
//               onClick={() => handleRemoveWidget(widget._id)}
//               title="Eliminar widget"
//             >
//               X
//             </span>
//             {widgetComponents[widget.type]?.()}
//           </div>
//         ))}
//       </GridLayout>
//     </div>
//   );
// }

// export default WidgetSystem;
