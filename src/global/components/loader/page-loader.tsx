

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export const PageLoader = ({ message, className = "" }: PageLoaderProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-blue-500/20 animate-ping" />
        {/* Icon container */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-gray-700 shadow-lg relative z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="white"
            className="w-6 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>

      {message && (
        <p className="text-sm font-medium text-gray-500 dark:text-white/40 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
