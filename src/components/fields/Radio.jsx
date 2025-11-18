import React, {useId, forwardRef, useState} from 'react'

function Radio({
    label = '',
    name = '',
    value = '',
    isSelected = false,
    onChange,
    ...props
}, ref) {
    const id = useId();
    return (
        <label htmlFor={id} className="flex items-center space-x-2 border border-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 transition duration-150 ease-in-out cursor-pointer bg-gray-50 hover:bg-indigo-50 has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600">
            <input
                type="radio"
                id={id}
                name={name}
                ref={ref}
                checked={isSelected}
                onChange={onChange}
                className="absolute opacity-0 h-0 w-0"
                {...props}
            />
            <span>{label}</span>
        </label>
    )
}

export default forwardRef(Radio);