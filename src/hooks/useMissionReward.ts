import { useSelector } from "react-redux";
import { RootState } from "../store/store";

function useMissionReward() {
  const missionReward = useSelector(
    (state: RootState) => state.mission.currentMissionReward
  );

  return missionReward;
}

export default useMissionReward;
