import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginSignup = () => {
  const [state,setState] = useState("Login")
  const [formData,setFormData] = useState({
    name:"",
    password:"",
    email:""
})

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async () => {
    console.log("Login function Executed",formData);
    let responseData;
    await fetch('https://shoppy-server-by-thalir.onrender.com/login', {
        method: 'POST',
        headers: {
            Accept:'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data)
    
    if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
    }
    else{
        alert(responseData.errors);
    }  
}

  const signup = async () => {
    console.log("Signup function Executed",formData);
    let responseData;
    await fetch('https://shoppy-server-by-thalir.onrender.com/signup', {
        method: 'POST',
        headers: {
            Accept:'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data)
    
    if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
    }
    else{
        alert(responseData.errors);
    }

  }

  return (
    <div
      className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-4"
      style={{ backgroundColor: '#fce3fe' }}
    >
      <div
        className="bg-white p-4 p-md-5 rounded shadow-sm w-100"
        style={{ maxWidth: '420px' }}
      >
        <h2 className="mb-3 text-center text-dark fw-bold fs-4">{state}</h2>

        <form className="d-flex flex-column gap-3">
          {state==="Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" className="form-control" placeholder="Your Name" />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" className="form-control" placeholder="Email Address" />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" className="form-control" placeholder="Password" />
          <button onClick={()=>{state==="Login"?login():signup()}} type="submit" className="btn btn-danger w-100 fw-semibold mt-2">
            Continue
          </button>
        </form>

        {state==="Sign Up"
        ?<p className="mt-3 text-center text-secondary small">
          Already have an account?
          <span onClick={()=>setState("Login")} className="text-danger fw-semibold" style={{ cursor: 'pointer' }}>
            Login here
          </span>
        </p>:
        <p className="mt-3 text-center text-secondary small">
          Create an account?
          <span onClick={()=>setState("Sign Up")} className="text-danger fw-semibold" style={{ cursor: 'pointer' }}>
            Click here
          </span>
        </p>}

        <div className="d-flex align-items-start gap-2 mt-3 text-secondary small">
          <input type="checkbox" />
          <p className="mb-0">
            By continuing, I agree to the terms of use & privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
