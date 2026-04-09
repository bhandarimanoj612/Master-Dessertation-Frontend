// src/global/components/error/error-screen.tsx
import React, { useEffect, useState } from "react";
// Assuming you have a Spinner component for the retry button.
// If not, you can create a simple one like this:
// export const Spinner: React.FC = () => (
//   <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
//     <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
//   </div>
// );

interface ErrorScreenProps {
  error: boolean;
  setError: (error: boolean) => void;
  errorMessage?: string; // Main user-friendly message
  errorDetails?: string; // Optional detailed message/solution
  onRetry?: () => Promise<void> | void; // Callback for retry action
  onDismiss?: () => void; // Optional callback for custom dismiss logic
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  setError,
  errorMessage = "Something went wrong. Please try again.",
  errorDetails,
  onRetry,
  onDismiss,
}) => {
  const [canDismiss, setCanDismiss] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const dismissDelayMs = 3000; // 3 seconds delay before dismiss is active

  useEffect(() => {
    if (error) {
      setCanDismiss(false); // Reset for new error occurrences
      setShowDetails(false); // Hide details on new error
      const timer = setTimeout(() => {
        setCanDismiss(true);
      }, dismissDelayMs);

      return () => clearTimeout(timer);
    }
  }, [error, dismissDelayMs]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry(); // Execute the provided retry logic
        setError(false); // If retry succeeds, dismiss the error screen
      }
    } catch (err) {
      console.error("Error during retry:", err);
      // You might want to update errorMessage here if retry fails again
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDismiss = () => {
    if (canDismiss) {
      if (onDismiss) {
        onDismiss(); // Execute custom dismiss logic
      }
      setError(false); // Always hide the error screen on dismiss
    }
  };

  // Do not render anything if there's no error
  if (!error) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-500
      flex flex-col items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm
      opacity-100 pointer-events-auto`} // Always visible if 'error' is true
    >
      <div className="relative p-8 max-w-lg mx-auto bg-neutral-800 rounded-2xl shadow-2xl flex flex-col items-center space-y-6 animate-fade-in-up">
        {/* Main Error Icon Section */}
        <div className="text-4xl md:text-8xl font-bold text-red-500 relative">
          {/* Animated error icon */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden transform transition-all duration-700 ease-out"
            style={{
              width: error ? "100%" : "0%",
              height: error ? "100%" : "0%",
              opacity: error ? 1 : 0,
            }}
          >
            <div className="flex items-center justify-center w-20 h-20 p-2 rounded-full bg-gradient-to-br from-red-800 to-red-600 shadow-lg border-2 border-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message Section */}
        <div className="text-center space-y-3">
          <h2 className="text-red-400 text-3xl font-extrabold tracking-tight">
            Oops! Error Occurred
          </h2>
          <p className="text-gray-300 text-lg">{errorMessage}</p>

          {/* Error Details (Toggleable) */}
          {errorDetails && (
            <div className="mt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium focus:outline-none flex items-center justify-center mx-auto"
              >
                {showDetails ? "Hide Details" : "Show Details"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    showDetails ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showDetails && (
                <pre className="mt-2 text-xs text-gray-500 bg-neutral-900 p-3 rounded-md overflow-x-auto text-left whitespace-pre-wrap">
                  {errorDetails}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
          {onRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isRetrying ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4-2m0 0l-4-2m4 2l-4 2m0 0V6m0 6h6m-6 0H6m6 0l-4-2m4 2l4-2"
                    />
                  </svg>
                  <span>Retrying...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001m-4.992 0L2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  <span>Try Again</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleDismiss}
            disabled={!canDismiss}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed
            text-white font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            {canDismiss
              ? "Dismiss"
              : `Please wait (${(dismissDelayMs / 1000).toFixed(0)}s)`}
          </button>
        </div>
      </div>
    </div>
  );
};
