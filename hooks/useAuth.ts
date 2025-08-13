"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';

function useAuth() {
 
  const userDetails = useSelector( (state: RootState) => state.auth);

  return userDetails
}
export default useAuth;
  