import React, { useState, useCallback } from "react";
import SearchBar from "./search-bar";
import { ImagesIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface MissionSearchProps {
  missionDescription: string;
  children?: React.ReactNode;
  option?: boolean;
  varient?: "image" | "text";
}

interface SearchResult {
  id: number;
  title: string;
  image: string;
}

const MissionSearchPlaceholder = ({
  missionDescription,
  children,
  option,
  varient,
}: MissionSearchProps) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasInput, setHasInput] = useState(false);

  const handleSearch = useCallback((query: string) => {
    // This is a mock search function. In a real application, you would typically
    // fetch results from an API or filter through a larger dataset.
    const mockResults: SearchResult[] = [
      { id: 1, title: "Value Option 1", image: "/placeholder.svg" },
      { id: 2, title: "Value Option 2", image: "/placeholder.svg" },
      { id: 3, title: "Value Option 3", image: "/placeholder.svg" },
      { id: 4, title: "Value Option 4", image: "/placeholder.svg" },
    ].filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
  }, []);

  const handleInputChange = useCallback((hasInput: boolean) => {
    setHasInput(hasInput);
  }, []);

  return (
    <section className="min-h-screen  gap-16 p-5 flex justify-center items-center mx-auto container relative z-40 ">
      {children}
      <div className="grid grid-cols-6  gap-10 ">
        <div className="col-span-3 flex flex-col justify-center relative -top-16 text-2xl font-light">
          <div>
            {/* Mission Description Here */}
            <p>{missionDescription}</p>

            <SearchBar
              onSearch={handleSearch}
              onInputChange={handleInputChange}
            />
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
        {option === true ? (
          <div className="col-span-3 justify-between gap-4 grid grid-flow-row">
            {varient === "image" ? (
              <div className=" h-[520px] w-[90%]  border-neutral-300 bg-[#F4F4F4] justify-center items-center flex rounded-[5px]">
                <ImagesIcon />
              </div>
            ) : varient === "text" ? (
              <div className=" h-[520px] w-[90%] border-2  border-black border-opacity-50 border-dashed bg-[#F4F4F4] justify-center items-center flex rounded-[15px]">
                Select Employee
              </div>
            ) : (
              <></>
            )}

            <div className=" h-10 ">
              <Button className=" w-full h-full border bg-transparent text-black border-neutral-200 rounded-[5px] justify-start">
                Option
              </Button>
            </div>
          </div>
        ) : (
          <div className="col-span-3 flex">
            {varient === "image" ? (
              <div className=" h-[520px] w-[90%]  border-neutral-300 bg-[#F4F4F4] justify-center items-center flex rounded-[5px]">
                <ImagesIcon />
              </div>
            ) : (
              <div className=" h-[520px] w-[90%] border-2  border-black border-opacity-50 border-dashed bg-[#F4F4F4] justify-center items-center flex rounded-[15px]">
                Select Employee
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MissionSearchPlaceholder;
