import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const companyArray = [];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        setInput({...input, companyId:selectedCompany._id});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message, { duration: 1000 });
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message, { duration: 1000 });
        } finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit = {submitHandler} className='p-8 max-w-4xl border border-gray-200 bg-white rounded-md dark:border-[#444444] dark:bg-[#121212]'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">Experience Level</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-900 dark:text-[#E0E0E0]">No of Position</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="h-10 rounded-md border-gray-200 focus-visible:ring-0 dark:border-[#444444] mt-1"
                            />
                        </div>
                        {
                            companies.length > 0 && (
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger className="h-10 rounded-md border-gray-200 dark:border-[#444444]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-md border-gray-200 bg-white dark:border-[#444444] dark:bg-[#121212]">
                                        <SelectGroup>
                                            {
                                                companies.map((company) => {
                                                    return (
                                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()} className="text-gray-900 dark:text-[#E0E0E0]">{company.name}</SelectItem>
                                                    )
                                                })
                                            }

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div> 
                    {
                        loading ? <Button className="w-full my-4 h-10 rounded-md bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 h-10 rounded-md bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-[#121212] dark:hover:bg-gray-200">Post New Job</Button>
                    }
                    {
                        companies.length === 0 && <p className='text-sm text-red-600 font-semibold text-center my-3'>Please register a company first before posting jobs</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default PostJob