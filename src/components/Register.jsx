import React, { useRef, useState } from 'react'
import './register.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faCross, faMapMarkerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Register = ({setShowRegister}) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false)
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            await axios.post("/api/user/register", newUser);
            setError(false)
            setSuccess(true)
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
                <input type='text' placeholder='username' ref={nameRef} />
                <input type='email' placeholder='email' ref={emailRef} />
                <input type='password' placeholder='password' ref={passwordRef} />
                <button className='regBtn'>Register</button>
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
                    onClick={()=> setShowRegister(false)}
                />
            </div>

        </div>
        
    
    )
}

export default Register