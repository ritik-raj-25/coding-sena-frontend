import React from 'react'
import userService from '../codingsena/userService'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Button from './fields/Button'
import { logout } from '../store/authSlice'

function DeactivateAccount() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = async () => {
        try {
            const response = await userService.deactivateAccount();
            if (response.success) {
                toast.success(response.message || "Account deactivated successfully", {
                    onClose: () => {
                        dispatch(logout());
                        setTimeout(() => {
                            navigate('/restore-account');
                        }, 50)
                    }
                });
            }
            else {
                toast.error(response.message || "Account deactivation failed.");
            }
        } catch (error) {
            toast.error(response.message || "Account deactivation failed.");
        }
    }

    return (
        <div className="p-4 md:p-6 space-y-6">

            <h2 className="text-2xl font-bold text-indigo-900 mb-6 border-b pb-3">
                Deactivate Your Account
            </h2>

            <p className="text-sm text-indigo-600 font-medium">
                We're sorry to see you go. Your educational journey is important to us.
            </p>

            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-gray-700 rounded-md">
                <p className="font-semibold text-red-600">Important: Read Before Proceeding</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>This action will immediately <span className="font-semibold">log you out</span> and pause your account access.</li>
                    <li>Your account status will be set to <span className="font-semibold">inactive</span>.</li>
                    <li>You can <span className="font-semibold">restore your account</span> any time via the dedicated restore page.</li>
                </ul>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm">
                To confirm that you wish to pause your learning progress and deactivate your account, please click the button below.
            </p>

            <div className="pt-4 flex justify-end">
                <Button 
                    onClick={handleClick}
                    className="bg-red-500 hover:bg-red-600 font-semibold focus:ring-4 focus:ring-red-500/50"
                >
                    Confirm Account Deactivation
                </Button>
            </div>
        </div>
    )
}

export default DeactivateAccount