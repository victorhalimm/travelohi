import "./index.scss";
import "./firebase/firebaseConfig";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routeCollection from "./models/Route";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {routeCollection.map((route) => (
            <Route
              element={
                route.name === "Hotel Detail" || route.name === "Game" || route.name === 'Flight Detail' ? (
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
              path={route.route}
            ></Route>
          ))}
        </Routes>
      </Router>
    </>
  );
}

export default App;
