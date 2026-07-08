// export default function PageLoader({ label = "Loading..." }) {
//   return (
//     <div style={{
//       minHeight: "60vh",
//       display: "grid",
//       placeItems: "center",
//       padding: "24px"
//     }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{
//           width: 44, height: 44,
//           borderRadius: "50%",
//           border: "4px solid rgba(0,0,0,0.12)",
//           borderTopColor: "rgba(0,0,0,0.6)",
//           margin: "0 auto 12px",
//           animation: "spin 0.8s linear infinite"
//         }} />
//         <div style={{ opacity: 0.8, fontWeight: 600 }}>{label}</div>

//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     </div>
//   );
// }