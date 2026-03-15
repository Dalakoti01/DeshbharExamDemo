import { setAllAdmitCards } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetAllAdmitCards = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdmitCards = async () => {
            try {
                const res = await axios.get("/api/admit-card/getAllAdmitCard");
                if(res.data.success){
                    dispatch(setAllAdmitCards(res.data.allAdmitCards || []))
                    toast.success(res.data.message || "All Admit Cards fetched successfully");
                } else{
                    toast.error(res.data.message || "Failed to fetch admit cards. Please try again later.");
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch admit cards. Please try again later.");
            }
        }
        fetchAllAdmitCards()
     },[dispatch])
}

export default useGetAllAdmitCards