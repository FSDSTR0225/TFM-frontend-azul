// components/MainScrollWrapper.jsx
import { Scrollbar } from "react-scrollbars-custom";
import "../style/MyScrollBar.css";

export default function MyScrollBar({ children }) {
  return (
    <Scrollbar
      style={{
        height: "calc(100vh - 72px)",
        padding: "0 0.3rem",
        width: "100%",
        overflowX: "auto",
      }}
      removeTracksWhenNotUsed
      noScrollX={false} // aseguramos que permita scroll-x si realmente se requiere
    >
      {children}
    </Scrollbar>
  );
}

// import { useState } from "react";
// import { Scrollbar } from "react-scrollbars-custom";

// export default function MyScrollBar({ children }) {
//   const [hover, setHover] = useState(false);

//   return (
//     <Scrollbar
//       style={{
//         height: "calc(100vh - 72px)",
//         padding: "0 0.3rem",
//         background: "transparent",
//       }}
//       noScrollX
//       trackYProps={{
//         style: {
//           background: "linear-gradient(135deg, #181a2a 60%, #23243a 100%)",
//           borderRadius: "8px",
//           boxShadow: "0 0 8px #00ffc822 inset",
//           width: "8px",
//           right: "2px",
//         },
//       }}
//       thumbYProps={{
//         style: {
//           background: hover
//             ? "linear-gradient(120deg, #66fcf1 10%, #00ffc8 90%)"
//             : "linear-gradient(120deg, #00ffc8 10%, #66fcf1 90%)",
//           borderRadius: "8px",
//           border: "1.5px solid #181a2a",
//           backgroundClip: "padding-box",
//           boxShadow: hover
//             ? "0 0 32px #00ffc8cc, 0 0 12px #66fcf1cc inset"
//             : "0 0 12px #00ffc8cc, 0 0 4px #66fcf1cc inset",
//           minHeight: "32px",
//           width: "8px",
//           margin: "0",
//           opacity: hover ? 0.95 : 0.7,
//           transition:
//             "background 0.3s, box-shadow 0.3s, filter 0.3s, opacity 0.3s",
//           animation: hover
//             ? "neon-glow-fast 0.8s infinite alternate"
//             : "neon-glow 2.2s infinite alternate",
//         },
//         onMouseEnter: () => setHover(true),
//         onMouseLeave: () => setHover(false),
//       }}
//     >
//       {children}
//     </Scrollbar>
//   );
// }
