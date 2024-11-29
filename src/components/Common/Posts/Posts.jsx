import React, { useState } from "react";
import Loading from "../../Loading/Loading";
import PostsCard from "./PostsCard";
import { Blog } from "../../../Context/Context";
import "./post.css"

const Posts = () => {
  const { postData, postLoading } = Blog();

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState("");

  // Categories you want to show above the posts
  const categories = ["Ekologiya", "İT", "Geologiya", "İncəsənət", "Psixologiya"];

  // Normalize the category and post tags for case-insensitive and diacritic-insensitive comparison
  const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filter posts based on selected category
  const filteredPosts = Array.isArray(postData) ? postData.filter((post) => {
    if (!selectedCategory) return true; // If no category is selected, show all posts
    const normalizedCategory = normalizeString(selectedCategory);
    return post.tags.some((tag) => normalizeString(tag) === normalizedCategory);
  }) : []; // Fallback to an empty array if postData is not an array

  return (
    <section className="flex-col gap-[2.5rem] items-center justify-center">
      {/* Category filter section */}
      <div className="flex gap-4 flex-wrap">
  <button
    onClick={() => setSelectedCategory("")}
    className={`category-button ${!selectedCategory ? "active" : ""}`}
  >
    Son paylaşımlar
  </button>
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`category-button ${selectedCategory === category ? "active" : ""}`}
    >
      {category}
    </button>
  ))}
</div>

      {/* Post Cards */}
      {postLoading ? (
        <Loading />
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {filteredPosts.map((post, i) => (
            <PostsCard post={post} key={i} />
          ))}
        </section>
      )}
    </section>
  );
};

export default Posts;
