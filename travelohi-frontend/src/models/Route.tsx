import { Navigate } from "react-router-dom";
import GamePage from "../pages/GamePage/GamePage";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import PredictPage from "../pages/PredictPage/PredictPage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import SearchHotelPage from "../pages/SearchHotelPage/SearchHotelPage";
import HotelDetailPage from "../pages/HotelDetailPage/HotelDetailPage";
import FlightSearch from "../pages/SearchFlightPage/FlightSearch";
import AuthenticatedRoute from "../components/ProtectedRoute/AuthenticatedRoute";
import FlightDetailPage from "../pages/FlightDetailPage/FlightDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import SearchHotelPredictPage from "../pages/SearchHotelPage/SearchHotelPredictPage";

interface IRoute {
  name: string;
  element: JSX.Element;
  route: string;
}

const routeCollection: IRoute[] = [
  {
    name: "Login",
    element: (
      <AuthenticatedRoute>
        <LoginPage />
      </AuthenticatedRoute>
    ),
    route: "/login",
  },
  {
    name: "Register",
    element: (
        <AuthenticatedRoute>
          <RegisterPage />
        </AuthenticatedRoute>
      ),
    route: "/register",
  },
  {
    name: "Home",
    element: <HomePage />,
    route: "/home",
  },
  {
    name: "Game",
    element: <GamePage />,
    route: "/game",
  },
  {
    name: "Default",
    element: <Navigate to="/login" />,
    route: "/",
  },
  {
    name: "Predict",
    element: <PredictPage />,
    route: "/predict",
  },
  {
    name: "Settings",
    element: <SettingsPage />,
    route: "/settings",
  },
  {
    name: "Admin",
    element: <AdminPage />,
    route: "/admin",
  },
  {
    name: "Search Hotel",
    element: <SearchHotelPage />,
    route: "/search/hotel",
  },
  {
    name: "Hotel Detail",
    element: <HotelDetailPage />,
    route: "/hotel/:id",
  },
  {
    name: "Search Flight",
    element: <FlightSearch />,
    route: "/search/flight",
  },
  {
    name: "Flight Detail",
    element: <FlightDetailPage />,
    route: "/flight/:id"
  },
  {
    name: "Cart",
    element: <CartPage />,
    route: "/cart"
  },
  {
    name: "Hotel Predict",
    element: <SearchHotelPredictPage />,
    route: "/search/hotel/predict"
  }
];

export default routeCollection;
