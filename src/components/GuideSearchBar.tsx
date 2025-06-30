import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function GuideSearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value.trim());
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [value, onSearch]);

  return (
    <div className="flex items-center w-full max-w-md mx-auto bg-gray-700 rounded-md px-3 py-1">
      <FaSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        className="bg-transparent outline-none text-white w-full placeholder-gray-400"
        placeholder="Search guides by name, city, or expertise..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search guides"
      />
    </div>
  );
}
