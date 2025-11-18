import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from './fields/Button'
import defaultProfilePic from '../assets/default_profile_image.png'
import ProfileField from './ProfileField'

function ViewProfile() {

    const user = useSelector((state) => state.authSlice.userData);
    const navigate = useNavigate();

    const dateStr = user?.createdAt;
    const [datePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const monthName = dateObj.toLocaleString("en-US", { month: "long" });
    const fullYear = dateObj.getFullYear();

    return (
        <div className='p-2 sm:p-4 space-y-8 h-full'>
            
            <div className='flex flex-col items-center border-b border-indigo-100 pb-6'>
                <img 
                    src={user?.profilePicUrl || defaultProfilePic} 
                    alt="Profile Image" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-xl mb-3"
                />
                <h2 className="text-2xl font-extrabold text-indigo-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">Member since {monthName} {fullYear}</p>
            </div>

            <div className='space-y-6'>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-indigo-900 mb-2 border-b pb-3">Contact Information</h3>
                    <ProfileField label="Email Address" value={user?.email} />
                    <ProfileField label="Location" value={user?.location} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-indigo-900 mb-2 border-b pb-3">Additional Information</h3>
                    <ProfileField label="Date of Birth (DOB)" value={user?.dob} />
                    <ProfileField label="College/University" value={user?.college} />
                    <ProfileField 
                        label="Technical Skills" 
                        value={user?.skills || []} 
                        isSkill={true} 
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button 
                        onClick={() => navigate('/dashboard/update-profile')}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3"
                    >
                        Edit Profile Information
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ViewProfile