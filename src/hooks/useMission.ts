import { useSelector } from "react-redux";
import { RootState } from "../store/store";

function useMission() {
  const missionDetails = useSelector(
    (state: RootState) => state.mission.currentMission
  );

  return missionDetails;
}

export default useMission;
