import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store=>store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8'>
                <div className="mb-8">
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-[#E0E0E0]'>
                        Job Applicants
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-[#888888]">
                        {applicants?.applications?.length || 0} candidate{applicants?.applications?.length !== 1 ? 's' : ''} applied for {applicants?.title || 'this position'}
                    </p>
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="rounded-lg border border-gray-200 bg-white dark:border-[#444444] dark:bg-[#121212] shadow-sm">
                        <ApplicantsTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Applicants