
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - isLoading:", isLoading, "user:", !!user);
  
  // Only show loading indicator while actually loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Once loading is complete, check if user exists
  if (!user) {
    console.log("Redirecting to auth page from:", location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // User is authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
