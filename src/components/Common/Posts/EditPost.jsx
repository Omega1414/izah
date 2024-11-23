import React, { useEffect, useState } from "react";
import { Blog } from "../../../Context/Context";
import ReactQuill from "react-quill-new";

const EditPost = () => {
  const { updateData, title, setTitle, description, setDescription } = Blog();

  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setDescription(updateData.description);
    }
  }, [updateData]);

  return (
    <section className="write w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
      <input
        type="text"
        placeholder="Title..."
        className="text-4xl outline-none w-full dark:bg-gray-500 border-2 border-gray-200 p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill
        placeholder="Description..."
        className="!text-[4rem] my-3 border-2 p-2"
        theme="bubble"
        value={description}
        onChange={setDescription}
      />
    </section>
  );
};

export default EditPost;