import { useEffect } from "react";

export const LoadingScreen = (props: any) => {
  const { started, setStarted } = props;

  useEffect(() => {
    // Simulate loading process, e.g., waiting for API data, assets, etc.
    const fakeLoadingTime = 2000; // 2 seconds

    const timer = setTimeout(() => {
      setStarted(true);
    }, fakeLoadingTime);

    return () => clearTimeout(timer); // Cleanup timeout if component unmounts
  }, [setStarted]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none
      flex items-center justify-center bg-black 
      ${started ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-4xl md:text-9xl font-bold text-blue-600 relative">
        <div
          className="absolute left-0 top-0 overflow-hidden truncate text-clip transition-all duration-500"
          style={{
            width: `${started ? "100%" : "0%"}`,
          }}
        >
          <div className="flex items-center justify-center mt-1  w-16 h-20 p-1 max-sm:w-10 max-sm:h-11  rounded-full bg-gradient-to-r from-blue-900 to-gray-700 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 22"
              strokeWidth="2"
              stroke="white"
              className="w-6 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        <div className="opacity-40">
          <div className="flex items-center justify-center mt-1  w-16 h-20 p-1 max-sm:w-10 max-sm:h-11  rounded-full bg-gradient-to-r from-blue-900 to-gray-700 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 22"
              strokeWidth="2"
              stroke="white"
              className="w-6 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
