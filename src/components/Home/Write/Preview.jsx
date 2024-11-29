import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import TagsInput from "react-tagsinput";
import { toast } from "react-toastify";
import { db, storage } from "../../../firebase/firebase";
import { Blog } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "./styles.css";

const Preview = ({ setPublish, description, title }) => {
  const imageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState(""); // Separate input for tag
  const [desc, setDesc] = useState("");
  const { currentUser } = Blog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState({
    title: "",
    photo: "",
  });

  useEffect(() => {
    if (title || description) {
      setPreview({ ...preview, title: title });
      setDesc(description);  // Ensure description is set even if it's empty
    } else {
      setPreview({ ...preview, title: "" });
      setDesc("");  // Ensure description is empty if not provided
    }
  }, [title, description]);

  const handleClick = () => {
    imageRef.current.click();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (preview.title === "" || desc === "" || tags.length === 0) {
        toast.error("Bütün xanaları doldurun (açar söz həmçinin)");
        return;
      }

      if (preview.title.length < 5) {
        toast.error("Başlıqda ən azı 5 simvol olmalıdır");
        return;
      }

      if (desc.length < 22) {
        toast.error("Açıqlama qismində ən az 22 simvol olmalıdır");
        return;
      }

      const collections = collection(db, "posts");

      let url;
      if (imageUrl) {
        const storageRef = ref(storage, `images/${preview.photo.name}`);
        await uploadBytes(storageRef, preview?.photo);

        url = await getDownloadURL(storageRef);
      }

      await addDoc(collections, {
        userId: currentUser?.uid,
        title: preview.title,
        desc, // Save the description with image URLs
        tags,
        postImg: url || "", // Main image URL
        created: Date.now(),
        pageViews: 0,
      });

      toast.success("Paylaşım əlavə olundu");
      navigate("/");
      setPublish(false);
      setPreview({
        title: "",
        photo: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a tag via the custom "Add" button
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput(""); // Clear input after adding
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (index) => {
    const updatedTags = tags.filter((tag, i) => i !== index);
    setTags(updatedTags);
  };

  return (
    <section className="absolute inset-0 bg-white dark:bg-darkBg z-30">
      <div className="size my-[2rem]">
        <span
          onClick={() => setPublish(false)}
          className="absolute right-[1rem] md:right-[5rem] top-[3rem] text-2xl cursor-pointer"
        >
          <LiaTimesSolid />
        </span>
        {/* preview the text */}
        <div className="mt-[8rem] flex flex-col md:flex-row gap-10">
          <div className="flex-[1]">
            <h3>Paylaşıma baxış</h3>
            <div
              style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : "", // Only apply backgroundImage if imageUrl exists
                backgroundSize: 'contain', // This will make sure the image fits without cropping
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: imageUrl ? 'auto' : 'full', // 200px if no image
                maxWidth: '800px', // Maximum width for the image
                maxHeight: '800px', // Maximum height for the image
              }}
              onClick={handleClick}
              className="mx-auto h-[300px] bg-gray-100 dark:bg-darkBg border-[1px] dark:border-darkText my-3 grid place-items-center cursor-pointer"
            >
              {!imageUrl && "Təqdimat şəkli"} {/* Show text placeholder when no image is loaded */}
            </div>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageObjectUrl = URL.createObjectURL(file);
                  setImageUrl(imageObjectUrl);  // Update the image URL state
                  setPreview({ ...preview, photo: file });
                }
              }}
              ref={imageRef}
              type="file"
              hidden
            />
            <input
              type="text"
              placeholder="Başlıq"
              className="outline-none w-full border-b p-2 border-gray-200  dark:border  dark:bg-darkBg py-2"
              value={preview.title}
              onChange={(e) =>
                setPreview({ ...preview, title: e.target.value })
              }
            />
            <ReactQuill
              theme="bubble"
              value={desc}
              onChange={setDesc}
              placeholder="Fikirlərini bölüş"
              className="py-1 my-2 border-b dark:border-[1px] border-gray-300 react-quill-container"
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline"],
                  ["link"],
                  ["image"],
                  [{ align: [] }],
                ],
              }}
              formats={["bold", "italic", "underline", "link", "image", "align"]}
            />
            <p className="text-gray-500 pt-4 text-sm">
              <span className="font-bold">Qeyd:</span> Saytımızın qaydalarına uyğun olmayan paylaşımlar etməməyiniz xahiş olunur, əksi təqdirdə xəbərdarlıq və ya profilin silinməsi ilə nəticələnəcək.
            </p>
          </div>
          <div className="flex-[1] flex flex-col gap-4 mb-5 md:mb-0">
           
            <p>
              Paylaşımınızın nə barədə olduğunu izah edən açar sözlər əlavə edin
            </p>
            <div className="flex gap-2 items-center">
              {/* Tags Input */}
              <input
                type="text"
                placeholder="Yeni tag əlavə et"
                className="border-b p-2 outline-none dark:bg-darkBg"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)} // Update the tag input value
              />
              {/* Add button */}
              <button
                onClick={handleAddTag}
                className="ml-2 p-2 bg-green-800 text-white rounded"
              >
                Əlavə et
              </button>
            </div>

            {/* Show Added Tags */}
            <div className="mt-2">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center"
                    >
                      {tag}
                      <span
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 cursor-pointer text-red-500"
                      >
                        X
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="btn !bg-green-800 !w-fit !text-white !rounded-full"
            >
              {loading ? "Yüklənilir..." : "Paylaş"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
