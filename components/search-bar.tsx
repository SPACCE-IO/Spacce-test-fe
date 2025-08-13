import type React from "react"
import { useState, useEffect, useCallback } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onInputChange: (isSearching: boolean) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onInputChange }) => {
  const [query, setQuery] = useState("")

  const handleSearch = useCallback(() => {
    onSearch(query)
    onInputChange(query.length > 0)
  }, [query, onSearch, onInputChange])

  useEffect(() => {
    const debounceTimer = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [handleSearch])

  return (
    <div>
      <form className="mx-auto">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border-b border-gray-300 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  )
}

export default SearchBar

