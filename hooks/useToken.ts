"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';

function useToken() {
 
  const userDetails = useSelector( (state: RootState) => state.token);

  return userDetails.token
}
export default useToken;
  