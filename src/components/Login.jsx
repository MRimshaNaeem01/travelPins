import React, { useRef, useState } from 'react'
import './login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Login = ({setShowLogin, myStorage, setCurrentUser}) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false)
    const userRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            username: userRef.current.value,
            password: passwordRef.current.value
        }
        try {
            const res = await axios.post("/api/user/login", newUser);
            console.log("myStorage", myStorage);
            setCurrentUser(res.data.username)
            myStorage.setItem("user", res.data.username)
            setShowLogin(false)
            setError(false)
        } catch (error) {
            console.log(error);
            setError(true)
        }

    }
    return (
         
      
        <div className='registerContainer'>
            <div className='logo'>
                <FontAwesomeIcon icon={faMapMarkerAlt}
                    style={{ color: 'slateblue' }}
                />
                <p> Rimsha Pins...</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='username' ref={userRef} />
                <input type='password' placeholder='password' ref={passwordRef} />
                <button className='regBtn'>Login</button>
                {
                    success && <span className='success'>Successfull.You can login now!</span>
                }
                {
                    error && <span className='error'>Something went wrong!</span>
                }

            </form>

            <div>
                <FontAwesomeIcon icon={faTimes} className='faCancel'
                    style={{ color: '' }}
                    onClick={()=> setShowLogin(false)}
                />
            </div>

        </div>
        
    
    )
}

export default Login