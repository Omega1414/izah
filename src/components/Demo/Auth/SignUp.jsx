import React, { useState } from 'react'
import Input from '../../../utils/Input'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const SignUp = ({setSignReq, setModal}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username:"",
    email: "",
    password: "",
    rePassword: "",
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(form[("username", "email", "password", "rePassword")] === "") {
      toast.error("Boş xana qalmamalıdır")
    } else if(form["password"] !== form["rePassword"]){
      toast.error("Daxil etdiyiniz kodlar eyni deyil")
      return;
    } else{
      setLoading(true)
      const {user} = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const ref = doc(db, "users", user.uid);
      const userDoc = await getDoc(ref);

      if(!userDoc.exists()){
          await setDoc(ref,{
              userId: user.uid,
              username: form.username,
              email: form.email,
              userImg: "https://media.istockphoto.com/id/1208175274/vector/avatar-vector-icon-simple-element-illustrationavatar-vector-icon-material-concept-vector.jpg?s=612x612&w=0&k=20&c=t4aK_TKnYaGQcPAC5Zyh46qqAtuoPcb-mjtQax3_9Xc=",
              bio: "",
              created: Date.now()
          });
         
          navigate("/");
          toast.success("Yeni istifadəçi yaradıldı");
          setModal(false)
    }
    setLoading(false)
  }
  }
  return (
    <div className='size mt-[6rem] text-center items-center justify-center'>
    <h2 className='text-3xl'>Email ünvanı ilə qeydiyyat</h2>
   
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full lg:w-[40%] mx-auto mt-10'>
    <Input form={form} setForm={setForm} type="text" title="Ad Soyad" />
    <Input form={form} setForm={setForm} type="email" title="email" />
    <Input form={form} setForm={setForm} type="password" title="şifrə" />
    <Input form={form} setForm={setForm} type="password" title="təkrar şifrə" />
    <button className={`px-4 py-1 text-sm rounded-full bg-green-600 hover:bg-green-800 
    text-white w-fit mx-auto ${loading? "opacity-50 pointer-events-none" : ""}`}>Qeydiyyat</button>
    </form>
    <button
     onClick={() => setSignReq("")}
     className='mt-5 text-sm text-green-600 hover:text-green-700 flex items-center mx-auto'>
    <MdKeyboardArrowLeft/>
    Digər qeydiyyat seçimləri</button>
    </div>
  )

}

export default SignUp