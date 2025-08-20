import React from "react";

interface DescriptionImageBProps {
  title: string;
  description: string;
  image: string;
  children?: React.ReactNode;
}

const DescriptionImageB = ( { title, description, image, children }: DescriptionImageBProps ) => {

  return (
    <section className="min-h-screen grid grid-rows-6 gap-16 p-5 mx-auto container ">
      <div className="flex flex-col gap-10 items-start align-top justify-start row-span-1 ">
        <h2 className=" text-erify-dark text-[36px] font-semibold py-5">
          {title}
        </h2>
      </div>
{children}
      <div className="grid grid-cols-5 gap-10 row-span-5 ">
        <div className="col-span-3 justify-center flex flex-col text-2xl font-light">
          <div className="flex flex-col gap-10">
            <p>
{description}
            </p>

            <div className="h-40 w-64 bg-neutral-300 rounded-[5px] justify-center items-center flex">
              {/* Place Image here */}

              {image}
            </div>
          </div>
        </div>
        <div className="col-span-2  justify-between grid grid-flow-row">

        </div>
      </div>
    </section>
  );
};

export default DescriptionImageB;
