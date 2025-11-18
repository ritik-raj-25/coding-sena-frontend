import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

function Protected({children, authentication = true}) {
    const navigate = useNavigate();
    const authStatus = useSelector(state => state.authSlice.status);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if(authentication && authStatus !== authentication) {
            navigate('/login');
        }
        if(!authentication && authStatus !== authentication) {
            navigate('/');
        }
        setLoading(false);
    }, [authStatus, authentication, navigate]);
    
    return loading ? <p>Loading...</p> : <>{children}</>
}

export default Protected