import { motion } from "framer-motion";

interface LogoProps {
  size?: number;        // control size
  rounded?: boolean;    // rounded full or xl
}

export default function Logo({
  size = 32,
  rounded = true,
}: LogoProps) {
  return (
    <motion.div
      className={`flex items-center justify-center shadow-lg 
        bg-gradient-to-r from-blue-900 to-gray-700
        ${rounded ? "rounded-full" : "rounded-xl"}
      `}
      style={{
        width: size,
        height: size,
      }}
      initial={{ rotate: 190 }}
      whileHover={{ rotate: 12 }}
      transition={{ type: "spring", stiffness: 600 }}
    >
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
    </motion.div>
  );
}