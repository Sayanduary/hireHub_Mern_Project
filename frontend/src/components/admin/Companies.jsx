import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8'>
                <div className='mb-6'>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Companies</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your company profiles</p>
                </div>
                <div className='flex items-center justify-between mb-6 gap-4'>
                    <Input
                        className="max-w-sm h-10 rounded-md border-gray-200 dark:border-gray-800"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button 
                        onClick={() => navigate("/admin/companies/create")}
                        className="h-10 px-4 rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        New Company
                    </Button>
                </div>
                <CompaniesTable/>
            </div>
        </div>
    )
}

export default Companies