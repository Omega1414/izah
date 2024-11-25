import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import Dropdown from '../../../../utils/DropDown'
import { Blog } from '../../../../Context/Context'
import { toast } from 'react-toastify'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../../../firebase/firebase'

const Actions = ({postId, title, desc}) => {
    const {setUpdateData, currentUser} = Blog()
    const [showDrop, setShowDrop] = useState(false)
    const handleClick = () => {
        setShowDrop(!showDrop)
    }

    const navigate = useNavigate(null)

    const handleEdit = () => {
     navigate(`/editPost/${postId}`)
     setUpdateData({title, description: desc})
    }
    const handleRemove = async() => {
     try {
        const ref = doc(db, "posts", postId)
        const likeRef = doc(db, "posts", postId, "likes", currentUser?.uid)
        const commentRef = doc(db, "posts", postId, "comments", currentUser?.uid)
        const savedPostRef = doc(db, "users", currentUser?.uid, "savedPost", postId)
        await deleteDoc(ref)
        await deleteDoc(likeRef)
        await deleteDoc(commentRef)
        await deleteDoc(savedPostRef)
        toast.success("Deleted")
        navigate("/")
     } catch (error) {
        toast.error(error.message)
     }
    }

  return (
    <div className='relative z-60' style={{ position: 'relative', zIndex: 100 }}>
        <button onClick={handleClick}>
            <BsThreeDots className='text-2xl' />
        </button>
        <Dropdown showDrop={showDrop} setShowDrop={setShowDrop} size="w-[7rem]">
            <Button click={handleEdit} title="Edit Story" />
            <Button click={handleRemove} title="Delete Story" />
        </Dropdown>
    </div>
  )
}

export default Actions

const Button = ({click, title}) => {
    return(
        <button
        onClick={click}
         className={`p-2 hover:bg-gray-100 hover:text-black/80 w-full text-sm text-left 
        ${title === "Delete Story" ? "text-red-600" : ""}`}>
            {title}
        </button>
    )
}