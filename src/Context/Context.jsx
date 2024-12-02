import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState, createContext } from "react";
import { auth, db } from "../firebase/firebase";
import Loading from "../components/Loading/Loading";
import { collection, onSnapshot, query } from "firebase/firestore";
import useFetch from "../components/hooks/useFetch";

const BlogContext = createContext();

const Context = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [commentLength, setCommentLength] = useState(0);
  const [authModel, setAuthModel] = useState(false);

  const [updateData, setUpdateData] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [publish, setPublish] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state from localStorage, if available
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? storedMode === 'true' : true; // Default to 'true' if not found
  });

  useEffect(() => {
    // Save the dark mode preference to localStorage whenever it changes
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

    // Apply dark mode class to the document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // get users
  useEffect(() => {
    const getUsers = () => {
      const postRef = query(collection(db, "users"));
      onSnapshot(postRef, (snapshot) => {
        setAllUsers(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        setUserLoading(false);
      });
    };
    getUsers();
  }, []);

  const { data: postData, loading: postLoading } = useFetch("posts");

  return (
    <BlogContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        userLoading,
        publish,
        setPublish,
        showComment,
        setShowComment,
        commentLength,
        setCommentLength,
        updateData,
        setUpdateData,
        title,
        setTitle,
        description,
        setDescription,
        postData,
        postLoading,
        authModel,
        setAuthModel,
        isDarkMode,
        setIsDarkMode
      }}>
      {loading ? <Loading /> : children}
    </BlogContext.Provider>
  );
};

export default Context;

export const Blog = () => useContext(BlogContext);
