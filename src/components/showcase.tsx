
export default function Showcase() {
    return (
      <div className=" w-full">
        {/* Header Image */}
        <div className="aspect-[3/1] h-[248px] w-screen overflow-hidden bg-gray-300">
          {/* <img
            src="/placeholder.svg?height=400&width=1200"
            alt="Cover"
            className="w-full h-full object-cover"
          /> */}
        </div>
  
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-8 container mx-auto">
          {/* Profile Info */}
          <div className="space-y-4  sm:col-span-1 -mt-[140px]">
            <div className=" aspect-[3/4] overflow-hidden bg-gray-300 border-4 rounded-[8px] border-[#1A1A1A] z-10">
              {/* <img
                src="/placeholder.svg?height=300&width=300"
                alt="Profile"
                className="w-full h-full object-cover"
              /> */}
            </div>
            <div className="w-full ">
              <h2 className="text-xl font-bold text-white">My Name is Here</h2>
              <p className="text-gray-400 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in
                hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices
                mauris. Maecenas vitae mattis tellus.
              </p>
            </div>
          </div>
  
          {/* Content */}
          <div className="lg:col-span-3 space-y-8 sm:col-span-2">
            {/* Highlights */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Highlights</h3>
              <div className="grid grid-cols-1 gap-[8px] md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-300">
                    {/* <img
                      src="/placeholder.svg?height=200&width=300"
                      alt={`Highlight ${i + 1}`}
                      className="w-full h-full object-cover"
                    /> */}
                  </div>
                ))}
              </div>
            </section>
  
            {/* Mission Collection */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Mission Collection</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[8px]">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className=" aspect-[4/3] rounded-lg overflow-hidden bg-gray-300">
                    {/* <img
                      src="/placeholder.svg?height=100&width=200"
                      alt={`Mission ${i + 1}`}
                      className="w-full h-full object-cover"
                    /> */}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
  
  