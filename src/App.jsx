import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./Components/UserPanel-Component/Home/Home";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./Components/ProtectedRoute"; 
import { AdminRoutes, UserRoutes } from "./Routes/Routes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>

          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {AdminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
          
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            {UserRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;