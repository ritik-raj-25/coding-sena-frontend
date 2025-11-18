import {useId, forwardRef} from "react"
import { IoSearchOutline } from "react-icons/io5";

function Input({
    label,
    type = 'text',
    className = "",
    withSearchIcon = false,
    ...props
}, ref) {
    const id = useId()
    
    const paddingClass = withSearchIcon ? 'pl-10 pr-4' : 'px-4';
    
    return (
        <div className={`${withSearchIcon ? 'relative' : ''}`}> 
            {
                label && <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
            }
            
            {withSearchIcon && (
                <div 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                >
                    <IoSearchOutline size={20} />
                </div>
            )}
            
            <input
                id={id}
                type={type}
                ref={ref}
                // 4. Use the dynamic padding class
                className={`${paddingClass} w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm focus:border-indigo-500 ${className} bg-white`}
                {...props}
            />
        </div>
    )
}

export default forwardRef(Input);