import React, {useState, useCallback} from "react";
import SearchBar from "./search-bar";
import { Button } from "@/components/ui/button";

interface Employee {
  title: string;
  description?: string;
  id?: number;
  name?: string;
  position?: string;
  image?: string;
  children?: React.ReactNode;
}

interface SearchResult {
  id: number
  title: string
  image: string
}

const MissionSearchEmployee = ( { children, title, description}: Employee ) => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [hasInput, setHasInput] = useState(false)
  
    const handleSearch = useCallback((query: string) => {
      // This is a mock search function. In a real application, you would typically
      // fetch results from an API or filter through a larger dataset.
      const mockResults: SearchResult[] = [
        { id: 1, title: "Value Option 1", image: "/placeholder.svg" },
        { id: 2, title: "Value Option 2", image: "/placeholder.svg" },
        { id: 3, title: "Value Option 3", image: "/placeholder.svg" },
        { id: 4, title: "Value Option 4", image: "/placeholder.svg" },
      ].filter((result) => result.title.toLowerCase().includes(query.toLowerCase()))
  
      setSearchResults(mockResults)
    }, [])

      const handleInputChange = useCallback((hasInput: boolean) => {
        setHasInput(hasInput)
      }, [])
      
  return (
    <section className="min-h-screen grid grid-rows-4 gap-16 p-5 mx-auto container ">
      <div className="flex flex-col gap-10 items-start align-top justify-start row-span-1 ">
        <h2 className=" text-erify-dark text-[36px] font-semibold py-5">
         {title}
        </h2>
      </div>
      {children}
      <div className="grid grid-cols-5 gap-10 row-span-3">
        <div className="col-span-3  flex flex-col text-2xl font-light">
          <div>
            <p>
                {description}
            </p>
            <SearchBar onSearch={handleSearch} onInputChange={handleInputChange} />
            {hasInput && (
              <div className="py-2 gap-2 flex flex-col">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="h-10 w-full border border-neutral-200 rounded-[5px] flex flex-row gap-2 items-center justify-start pl-1"
                  >
                    {/* <div className="h-8 w-8 bg-neutral-300 rounded-[5px] justify-center items-center flex">
                      <ImageIcon size={12} />
                    </div> */}
                    <p>{result.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2  justify-between grid grid-flow-row">
            <div className=" h-[520px] w-[372px] border-2 border-dashed border-neutral-300 bg-neutral-100 justify-center items-center flex rounded-[5px]">
            Select Employee
            </div>
            <div className=" h-10 ">
            <Button className=" w-full h-full border border-neutral-200 rounded-[5px] justify-start">
                Option
            </Button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSearchEmployee;
