import React from 'react';
import { useNavigate } from 'react-router-dom';
const Signin = () => {
  const [username,setUsername]=React.useState("")
  const [password,setPassword]=React.useState("")
  const url="http://localhost:5000"
  const navigate=useNavigate()
  async function handleSubmit(e){
    e.preventDefault();
    try{const response=await fetch(`${url}/auth/signin`,{
      method:"POST",
      headers:{"content-type":"application/json"},
      body: JSON.stringify({username,password})
      
    })
    const data=await response.json()
    if(response.ok){
      localStorage.setItem("token",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      alert("welcome back ")
      navigate("/dashboard")
    }
    else{
      alert(data.message||"login failed")
    }
  } catch(error){
    console.error("login error:" ,error)
    
  }


  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in.</p>
        </div>

        <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-semibold text-slate-700 ml-0.5">
                Username
              </label>
              <input
                id="username"
                onChange={(e)=>setUsername(e.target.value)}
                type="text"
                placeholder="e.g. jdoe_crm"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</a>
              </div>
              <input
                id="password"
                type="password"
                 onChange={(e)=>setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-md active:scale-[0.99]"
            >
              Sign in to CRM
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;