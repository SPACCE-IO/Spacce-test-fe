import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';

function useProfile() {
  const profileDetails = useSelector((state: RootState) => state.profile);

  return profileDetails;
}

export default useProfile;
