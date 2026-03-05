import { setSingleJob } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetSingleJob = (id) => {
    const dispatch = useDispatch();
    useEffect(() => {
       const fetchSingleJob = async () => {
        try {
            const res = await axios.get(`/api/getSingleJob/${id}`,{withCredentials:true});
            if(res.data.success){
                dispatch(setSingleJob(res.data.job));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch job details");
        }
       }
       fetchSingleJob()
    },[dispatch,id])
}

export default useGetSingleJob