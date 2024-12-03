import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../utils/Modal";
import { LiaTimesSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const EditProfile = ({ editModal, setEditModal, getUserData }) => {
  const imgRef = useRef(null);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    userImg: "",
    bio: "",
    allowSavedPosts: false, // Add this field to track saved post visibility
  });

  const btn = "border border-green-600 py-2 px-5 rounded-full text-green-600";
  const openFile = () => {
    imgRef.current.click();
  };

  useEffect(() => {
    if (getUserData) {
      setForm(getUserData);
    } else {
      setForm({ username: "", bio: "", userImg: "", allowSavedPosts: false });
    }
  }, [getUserData]);

  const saveForm = async () => {
    if (form["username"] === "" || form["bio"] === "") {
      toast.error("Boş xana qalmamalıdır");
      return;
    }

    setLoading(true);

    const storageRef = ref(storage, `image/${form.userImg.name}`);
    await uploadBytes(storageRef, form?.userImg);

    const imageUrl = await getDownloadURL(storageRef);

    try {
      const docRef = doc(db, "users", getUserData?.userId);
      await updateDoc(docRef, {
        bio: form.bio,
        username: form.username,
        userImg: imgUrl ? imageUrl : form.userImg,
        userId: getUserData?.userId,
        allowSavedPosts: form.allowSavedPosts? form.allowSavedPosts : false, // Save the setting to Firestore
      });
      setLoading(false);
      setEditModal(false);
      toast.success("Profil yeniləndi");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal modal={editModal} setModal={setEditModal}>
      <div className="center w-[95%] md:w-[45rem] bg-white dark:bg-darkBg  mx-auto  my-[1rem] z-20 mb-[3rem] p-[2rem]">
        {/* head */}
        <div className="flex items-center justify-between ">
          <h2 className="font-bold text-xl">Profile information</h2>
          <button onClick={() => setEditModal(false)} className="text-xl">
            <LiaTimesSolid />
          </button>
        </div>
        {/* body */}
        <section className="mt-6">
          <p className="pb-3 text-sm text-gray-500 dark:text-darkText">Şəkil</p>
          <div className="flex gap-[2rem]">
            <div className="w-[5rem]">
              <img
                className="min-h-[5rem] min-w-[5rem] object-cover border border-gray-400 rounded-full"
                src={imgUrl ? imgUrl : form.userImg ? form.userImg : "/profile.jpg"}
                alt="profile-img"
              />
             <div className="items-center justify-center flex flex-row">
      <input
        onChange={(e) => {
          setImgUrl(URL.createObjectURL(e.target.files[0]));
          setForm({ ...form, userImg: e.target.files[0] });
        }}
        accept="image/jpg, image/png, image/jpeg"
        ref={imgRef}
        type="file"
        style={{ display: 'none' }} // Hide the default button
      />
      {/* Custom button that triggers the file input */}
      <button
        onClick={() => imgRef.current.click()}
        style={{
          width: "90px",
          height: "40px",
          marginTop : "5px",
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Şəkil yüklə
      </button>
      
    </div>
            </div>
          </div>
        </section>
        {/* Profile edit form */}
        <section className="pt-[1rem] text-sm">
          <label className="pb-3 block" htmlFor="">
            Name*
          </label>
          <input
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            value={form.username}
            type="text"
            placeholder="username..."
            className="p-1 border-b border-black w-full outline-none dark:bg-darkBg dark:text-darkText dark:border-gray-200"
            maxLength={50}
          />
          <section className="pt-[1rem] text-sm">
            <label className="pb-3 block" htmlFor="">
              Bio*
            </label>
            <input
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              value={form.bio}
              type="text"
              placeholder="bio..."
              className="p-1 border-b border-black w-full outline-none dark:bg-darkBg dark:text-darkText dark:border-gray-200"
              maxLength={160}
            />
          </section>
          {/* Allow saved posts visibility checkbox */}
          <section className="pt-[1rem] flex">
            <label className="block text-sm text-gray-600 dark:text-darkText">
              Seçilənlər bölməsi hamıya açıq
            </label>
            <input
              type="checkbox"
              checked={form.allowSavedPosts}
              onChange={(e) => setForm({ ...form, allowSavedPosts: e.target.checked })}
              className="ml-2"
            />
          </section>
        </section>
        {/* foot */}
        <div className="flex items-center justify-end gap-4 pt-[2rem]">
          <button onClick={() => setEditModal(false)} className={btn}>Cancel</button>
          <button onClick={saveForm} className={`${btn} bg-green-800 text-white ${loading ? "opacity-50" : ""}`}>Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfile;