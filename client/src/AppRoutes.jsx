// import { Routes, Route, Navigate } from "react-router-dom";
// import { Suspense, lazy } from "react";
// import PageLoader from "./components/PageLoader";

// // Lazy load pages (this reduces initial JS bundle)
// const Home = lazy(() => import("./pages/Home"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Leaderboard = lazy(() => import("./pages/Leaderboard"));
// const Activities = lazy(() => import("./pages/Activities"));
// const Login = lazy(() => import("./pages/Login"));

// export default function AppRoutes() {
//   return (
//     <Suspense fallback={<PageLoader label="Loading page..." />}>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/leaderboard" element={<Leaderboard />} />
//         <Route path="/activities" element={<Activities />} />

//         {/* fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Suspense>
//   );
// }