import type React from "react";
import { useState } from "react";
import Button from "@atoms/Button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Buscar...",
  onSearch,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="primary" size="md">
        Buscar
      </Button>
    </form>
  );
}
