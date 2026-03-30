import React from 'react';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [name,setName]=React.useState("");
  const [email,setEmail]=React.useState("");  
  const [username,setUsername]=React.useState("");
  const [password,setPassword]=React.useState("");
  const navigate=useNavigate();
  const url="http://localhost:5000";
  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{const response=await fetch(`${url}/auth/signup`,{
      method:'POST',
      headers:{
        'content-type':'application/json'
      },
      body: JSON.stringify({
        name,email,username,password
      })
     
    })
    const data= await response.json();
    if(response.ok){
      alert("signup succesfull redirectiong to sign in")
      navigate("/");
    }
    else{
      alert(data.message||"something went wrong")
    }}
    catch(error){
      console.error(error)
      alert("failed to connect to the server")
    }
      }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h1>
          <p className="text-slate-500 text-sm mt-1">Start managing your customers better today.</p>
        </div>

        <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-0.5">
                Full Name
              </label>
              <input
                id="name"
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
              <label htmlFor="username" className="text-sm font-semibold text-slate-700 ml-0.5">
                Choose Username
              </label>
              <input
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="e.g. jdoe_crm"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-0.5">
                Email Address
              </label>
              <input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="e.g. jdoe@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-0.5">
                Password
              </label>
              <input
                id="password"
                onChange  ={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-md active:scale-[0.99]"
            >
              Get Started
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <a href="/" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;