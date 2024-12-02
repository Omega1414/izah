import React, { useState } from 'react'
import Modal from '../../../utils/Modal'
import { LiaTimesSolid } from 'react-icons/lia'
import { FcGoogle } from 'react-icons/fc'
import { MdFacebook } from 'react-icons/md'
import { AiOutlineMail } from 'react-icons/ai'
import SignIn from './SignIn'
import SignUp from './SignUp'
import { signInWithPopup } from 'firebase/auth'
import { auth, db, provider } from '../../../firebase/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Auth = ({modal, setModal}) => {
    const [createUser, setCreateUser] = useState(false)
    const [signReq, setSignReq] = useState("")
    const navigate = useNavigate()
    const googleAuth = async () => {
    try {
        const createUser = await signInWithPopup(auth, provider);
        const newUser = createUser.user;
        
        // Make sure photoURL exists before proceeding
        const userPhoto = newUser.photoURL || "defaultImageURL";  // fallback to default image if photoURL is empty
        
        const ref = doc(db, "users", newUser.uid);
        const userDoc = await getDoc(ref);

        if (!userDoc.exists()) {
            await setDoc(ref, {
                userId: newUser.uid,
                username: newUser.displayName,
                email: newUser.email,
                userImg: userPhoto,
                bio: "",
            });
            toast.success("Yeni hesab yaradıldı");
            setModal(false);
        }
        navigate("/");
    } catch (error) {
        toast.error(error.message);
    }
};
 
    const hidden = modal ? "visible opacity-100" : "invisible opacity-0" 
  return (
    <Modal modal={modal} setModal={setModal} hidden={hidden}>
      <section className={`z-50 fixed top-0 bottom-0 left-0 md:left-[10rem] overflow-auto right-0 md:right-[10rem] bg-white shadow-lg ${hidden} transition-all duration-500 ease-out dark:bg-darkBg`}>
            <button onClick={() => setModal(false)} className='absolute top-8 right-8 text-2xl hover:opacity-50'>
                <LiaTimesSolid />
            </button>
            <div className='flex flex-col justify-center items-center gap-[3rem]'>
               {signReq === "" ? (
                <>
                    <h2 className='text-2xl pt-[5rem]'>{createUser ? "Bizə qoşulun" : "Xoş gəldiniz"}</h2>
                    <div className='flex flex-col gap-2 w-fit max-auto'>
                        <Button 
                        click={googleAuth}
                        icon={<FcGoogle className='text-xl' />}
                         text={`Google ilə ${createUser ? "qeydiyyat" : "daxil ol"}`} />
                       
                        <Button
                        click={() => setSignReq(createUser ? "sign-up" : "sign-in")}
                         icon={<AiOutlineMail className='text-xl' />} 
                         text={`Mail ilə ${createUser ?  "qeydiyyat" : "daxil ol"}`} />
                    </div>

                    <p>
                    {createUser ? "Hesabın mövcuddur?" : "Hesabın yoxdur?"}
                        <button
                         onClick={() => setCreateUser(!createUser)}
                         className='text-green-600 hover:text-green-700 font-bold ml-1'>{createUser ? "Daxil ol" : "Qeydiyyatdan keç"}</button>
                    </p>
                </>
               ) : signReq === "sign-in" ? (
                <SignIn setModal={setModal} setSignReq={setSignReq} />
               ) : signReq === "sign-up" ? (
                <SignUp setModal={setModal} setSignReq={setSignReq} />
               ): null}
                <p className='md:w-[30rem] mx-auto text-center text-sm mb-[3rem]'>Saytdan qeydiyyatdan keçməklə saytın
                 <span onClick={() => toast.info("Sayt təqdimat məqsədlidir, hələki qaydalar tərtib olunmayıb")} className='text-blue-500 cursor-pointer ml-1'>qaydalarını</span> qəbul etmiş olursunuz</p>
            </div>
        </section>
    </Modal>
  )
}

export default Auth

const Button = ({icon, text, click}) => {
    return(
        <button
        onClick={click}
        className='flex items-center gap-3  border border-black dark:border-darkText px-3 py-2 rounded-full'>
        {icon}{text}
        </button>
    )
}