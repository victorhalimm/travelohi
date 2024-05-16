// src/components/PublicRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

const AuthenticatedRoute = ({
  children,
}: AuthenticatedRouteProps): JSX.Element => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error validating user:", error);
        setLoggedIn(false);
      }
    };

    validateUser();
  }, []);
  
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  // If not logged in, render the intended children components (like login or register pages)
  return <>{children}</>;
};

export default AuthenticatedRoute;
