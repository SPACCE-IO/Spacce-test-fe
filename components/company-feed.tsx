import { Button } from "@/components/ui/button";

interface CompanyFeedProps {
  layout: "grid" | "list";
  children: React.ReactNode;
}

export default function CompanyFeed({ layout, children }: CompanyFeedProps) {
  return (
    <div className="space-y-6 pb-11">
      <div className="aspect-[4/3] h-[248px] w-screen overflow-hidden bg-gray-300">
        {/* <img
            src="/placeholder.svg?height=400&width=1200"
            alt="Cover"s
            className="w-full h-full object-cover"
          /> */}
      </div>
      {children}
      {layout === "grid" ? (
        <div className="grid grid-cols-3 gap-[8px] mx-auto container">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2 aspect-[4/3]">
              <div className="  h-[324px] rounded-lg overflow-hidden bg-gray-300">
                {/* <img
                  src="/placeholder.svg?height=432&width=366"
                  alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover" */}
                {/* /> */}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-700" />
                <span className="text-sm text-gray-400">Name is Here</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 justify-start container mx-auto flex-col gap-6 flex items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-[650px] h-[466px] rounded-[8px] overflow-hidden bg-gray-300 ">
                {/* <img
                  src="/placeholder.svg?height=400&width=800"
                  alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[30px] h-[30px] rounded-full bg-gray-400" />
                <span className="text-sm text-gray-400">Name is Here</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <div className=" flex justify-center items-center w-[256px] h-[51px] p-[1px] bg-gradient-to-b from-[#F7F1FE] from-opacity-60 to-[#E0D6FD] rounded-[8px] ">
          <Button
            className="bg-[#1a1a1a] font-bold text-white rounded-[8px]  w-full h-full hover:bg-opacity-20"
          >
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}
