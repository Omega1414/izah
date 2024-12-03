import React, { useState } from "react";
import Loading from "../../Loading/Loading";
import PostsCard from "./PostsCard";
import { Blog } from "../../../Context/Context";
import "./post.css";
import Dropdown from "../../../utils/DropDown";
import { IoSearchOutline } from "react-icons/io5";

const Posts = () => {
  const { postData, postLoading } = Blog();

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState("Son paylaşımlar");

  // State for selected sort option
  const [sortOption, setSortOption] = useState("date-asc");

  // State for controlling the dropdown visibility
  const [showDrop, setShowDrop] = useState(false);

  // State for managing the zoom tool (search input visibility)
  const [showSearch, setShowSearch] = useState(false);

  // State for user input in the search
  const [searchTerm, setSearchTerm] = useState("");

  // Categories to display
  const categories = ["Son paylaşımlar","Ekologiya", "İT", "Geologiya", "İncəsənət", "Psixologiya", "Memarlıq", "Sənaye", "Mühəndislik", "Musiqi"];

  // Normalize the category and post tags for case-insensitive and diacritic-insensitive comparison
  const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Filter posts based on selected category
const filteredPosts = Array.isArray(postData) ? postData.filter((post) => {
  if (!selectedCategory || selectedCategory === "Son paylaşımlar") return true; // If no category or "Son paylaşımlar" is selected, show all posts
  const normalizedCategory = normalizeString(selectedCategory);
  return post.tags.some((tag) => normalizeString(tag) === normalizedCategory);
}) : []; // Fallback to an empty array if postData is not an array

  // Sort the filtered posts based on the selected option
  const sortedPosts = filteredPosts.sort((a, b) => {
    switch (sortOption) {
      case "most-viewed":
        return b.pageViews - a.pageViews; // Sort by most viewed (descending)
      case "least-viewed":
        return a.pageViews - b.pageViews; // Sort by least viewed (ascending)
      case "latest-first":
        return new Date(b.created).getTime() - new Date(a.created).getTime(); // Sort by latest first (descending)
      case "oldest-first":
        return new Date(a.created).getTime() - new Date(b.created).getTime(); // Sort by oldest first (ascending)
      case "title-asc":
        return a.title.localeCompare(b.title); // Sort by title A-Z
      case "title-desc":
        return b.title.localeCompare(a.title); // Sort by title Z-A
      default:
        return 0; // Default no sorting
    }
  });

  // Filter categories based on the search term
  const filteredCategories = categories.filter(category =>
    normalizeString(category).includes(normalizeString(searchTerm))
  );

  return (
    <section className="flex-col gap-[2.5rem] items-center justify-center">
  {/* Category filter section */}
  <div className="flex gap-4 flex-wrap">
    <div className="buttonSearch">
    <div className="flex flex-row items-center">
    <IoSearchOutline />
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input dark:bg-darkBg ml-2 focus:outline-none"
            placeholder="Search categories..."
          />
    </div>
   
     
     
    <div className="search-container overflow-hidden">
  <div className="category-button-container flex flex-wrap gap-3 mb-2">
    {filteredCategories.slice(0, 9).map((category, index) => (
      <button
        key={category}
        onClick={() => {
            setSelectedCategory(category); // Set category for other cases
          setShowSearch(false); // Close the search after selecting
          setSearchTerm(""); // Clear search input
        }}
        className={`category-button ${selectedCategory === category ? "active" : ""}`}
      >
        {category}
      </button>
    ))}
  </div>
</div>
  
    </div>
   
   
  </div>

  {/* Sorting dropdown section */}
  <div className="relative mt-3">
    <button
      onClick={() => setShowDrop(!showDrop)} // Toggle dropdown visibility
      className="sort-button"
    >
      Tənzimlə
      <span className={`arrow ${showDrop ? "rotate" : ""}`}>&#9662;</span>
    </button>

    <Dropdown showDrop={showDrop} setShowDrop={setShowDrop}  size="w-48">
          <button
            onClick={() => {
              setSortOption("most-viewed");
              setShowDrop(false);
            }}
            className={`dropdown-item ${sortOption === "most-viewed" ? "active" : ""}`}
          >
            Most Viewed
          </button>
          <button
            onClick={() => {
              setSortOption("least-viewed");
              setShowDrop(false);
            }}
            className={`dropdown-item ${sortOption === "least-viewed" ? "active" : ""}`}
          >
            Least Viewed
          </button>
          <button
            onClick={() => {
              setSortOption("latest-first");
              setShowDrop(false);
            }}
            className={`dropdown-item ${sortOption === "latest-first" ? "active" : ""}`}
          >
            Latest First
          </button>
          <button
            onClick={() => {
              setSortOption("oldest-first");
              setShowDrop(false);
            }}
            className={`dropdown-item ${sortOption === "oldest-first" ? "active" : ""}`}
          >
            Oldest First
          </button>
          <button
            onClick={() => {
              setSortOption("title-asc");
              setShowDrop(false);
            }}
            className={`dropdown-item ${sortOption === "title-asc" ? "active" : ""}`}
          >
            Title (A-Z)
          </button>
          <button
            onClick={() => {
              setSortOption("title-desc");
              setShowDrop(false);
            }}
            className={`dropdown-item ${sortOption === "title-desc" ? "active" : ""}`}
          >
            Title (Z-A)
          </button>
        </Dropdown>
      </div>

  {/* Post Cards */}
  {postLoading ? (
    <Loading />
  ) : (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
      {sortedPosts.map((post, i) => (
        <PostsCard post={post} key={i} />
      ))}
    </section>
  )}
</section>
  );
};

export default Posts;
