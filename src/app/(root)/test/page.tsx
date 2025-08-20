import MissionSearch from "@/app/components/mission-search";
import React from "react";

const page = () => {
  return (
    <section>
      <div className="flex-col sectionscroll">
        <div className="bg-yellow-200 sectionsnap"></div>
        <div className="bg-red-200 sectionsnap"></div>
        <div className="bg-blue-200  sectionsnap"></div>
      </div>
      <div className="sectionsnap">
      <MissionSearch
          title=""
          missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
        >

        </MissionSearch>
      </div>
    </section>
  );
};

export default page;
