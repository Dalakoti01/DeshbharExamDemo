import { setSingleAdmitCard } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'

const useGetSingleAdmitCard = (id) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSingleAdmitCard = async () => {
            try {
                const res = await axios.get(`/api/admit-card/getSingleAdmitCard/${id}`);
                if(res.data.success){
                    dispatch(setSingleAdmitCard(res.data.admitCard));
                    toast.success(res.data.message);
                } else{
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("An error occurred while fetching the admit card.")
            }
        }
        fetchSingleAdmitCard()
    },[dispatch])
}

export default useGetSingleAdmitCard