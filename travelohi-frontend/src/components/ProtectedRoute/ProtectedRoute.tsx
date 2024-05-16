// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {

  const [isLoggedIn, setLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/user', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
            console.log('Context ack that a user is logged in')
          setLoggedIn(true);
        } else {
            console.log("there isnt any user retrieved?")
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error validating user:', error);
        setLoggedIn(false);
      }
    };

    validateUser();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
