import { setSingleResult } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetSingleResult = (id) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleResult = async () => {
        try {
            const res = await axios.get(`/api/results/getSingleResult/${id}`)
            if(res.data.success){
                dispatch(setSingleResult(res.data.result));
                toast.success(res.data.message);
            } else{
                toast.error("Failed to fetch result details");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while fetching the result.")
        }
    }
    fetchSingleResult()
   },[dispatch])
}

export default useGetSingleResult