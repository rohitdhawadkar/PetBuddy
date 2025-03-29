import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const OAuth: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        console.log("Processing OAuth callback...");
        
        // Process the OAuth response
        const result = authService.handleOAuthCallback();
        console.log("OAuth result:", result);
        
        if (!result.success) {
          // If token wasn't found, there's an error
          console.error("Authentication failed, no token found");
          setError("Authentication failed. Please try again.");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          // On success, wait a moment and then redirect
          console.log("Authentication successful, redirecting to:", result.redirectPath);
          setTimeout(() => {
            navigate(result.redirectPath || "/dashboard");
          }, 1500);
        }
      } catch (err) {
        console.error("OAuth processing error:", err);
        setError("An error occurred during authentication. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setProcessing(false);
      }
    };

    handleOAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="max-w-md w-full space-y-8 p-10 card">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
            {processing ? "Processing your login..." : 
             error ? "Authentication Error" : "Authentication Successful"}
          </h2>
          
          {processing ? (
            <div className="mt-6 flex justify-center">
              <svg className="animate-spin h-10 w-10 text-[var(--color-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="mt-4 text-[var(--color-error)]">{error}</div>
          ) : (
            <div className="mt-4 text-[var(--color-success)]">
              Login successful! Redirecting you...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuth; 