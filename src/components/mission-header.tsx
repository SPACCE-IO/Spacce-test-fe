import React from 'react';

export default function MissionHeader({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-10 items-start align-top justify-start ">
          <h2 className=" text-erify-dark text-[36px] font-semibold py-5">
            {children}
          </h2>
        </div>
    );
}


