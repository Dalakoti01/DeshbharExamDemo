import { setAllResults } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetAllResults = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllResults = async () => {
        try {
            const res = await axios.get("/api/results/getAllResults");
            if(res.data.success){
                dispatch(setAllResults(res.data.allResults))
                toast.success("Results fetched successfully")
            } else{
                toast.error("Failed to fetch results")
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch results")
        }
    }
    fetchAllResults()
   }, [dispatch])
}

export default useGetAllResults