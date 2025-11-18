import React, { useId, forwardRef } from 'react'
import { FaChevronDown } from "react-icons/fa";

function DropDown({
    label = '',
    options = [],
    onChange,
    selectedOption,
    ...props
}, ref) {
    const id = useId();
    return (
        <div className="w-full">
            {label && 
                <label 
                    htmlFor={id} 
                    className="block text-sm font-medium text-gray-700 mb-3"
                >
                    {label}
                </label>
            }
            <div className="relative">
                <select 
                    id={id}
                    onChange={onChange}
                    ref={ref}
                    value={selectedOption}
                    className="
                        appearance-none block w-full
                        pl-3 pr-10 py-2 
                        border border-gray-300 
                        rounded-lg shadow-sm 
                        text-gray-700
                        focus:outline-none 
                        focus:ring-2 focus:ring-indigo-500 
                        focus:border-indigo-500 
                        text-base transition duration-150
                        h-10 cursor-pointer bg-white
                    " 
                    {...props}
                >
                    {
                        options.map((option => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                disabled={option.disabled}
                                className='w-full text-wrap'
                            >
                                {option.label}
                            </option>
                        )))
                    }
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    )
}

export default forwardRef(DropDown);