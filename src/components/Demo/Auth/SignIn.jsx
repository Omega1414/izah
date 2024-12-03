import React, { useState } from 'react'
import Input from '../../../utils/Input'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { toast } from 'react-toastify'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase/firebase'
import { useNavigate } from 'react-router-dom'

const SignIn = ({setSignReq}) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email:"",
    password:"",
  })
  const [loading, setLoading] = useState(false)
  const handleSubmit = async(e) => {
    e.preventDefault();
   
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
     
      navigate("/");
      setTimeout(() => {
        toast.success("Hesaba daxil oldunuz");
      }, 500);  
      
      setLoading(false);
     
    } catch (error) {
      if(form[("email", "password")] === ""){
        toast.error("Xahiş olunur məlumatları daxil edin")
      } else {toast.error(error.message)}
      setLoading(false)
    }
  }
  return (
    <div className='size mt-[6rem] text-center'>
    <h2 className='text-3xl'>Email ünvanı ilə daxil ol</h2>
    
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full lg:w-[45%] mx-auto mt-10'>
    <Input form={form} setForm={setForm} type="email" title="email" />
    <Input form={form} setForm={setForm} type="password" title="şifrə" />
    <button className={`px-4 py-1 text-sm rounded-full bg-green-600 hover:bg-green-800 
    text-white w-fit mx-auto ${loading? "opacity-50 pointer-events-none" : ""}`}>Daxil ol</button>
    </form>
    <button
     onClick={() => setSignReq("")}
     className='mt-5 text-sm text-green-600 hover:text-green-700 flex items-center mx-auto'>
    <MdKeyboardArrowLeft/>
    Digər seçimləri</button>
    </div>
  )
}

export default SignIn