import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Home from "./components/Home/Home"
import Demo from "./components/Demo/Demo"
import DemoHeader from "./components/Demo/DemoHeader";
import Context, { Blog } from "./Context/Context";
import { ToastContainer } from "react-toastify";
import HomeHeader from "./components/Home/Header/HomeHeader";
import Profile from "./components/Home/Profile/Profile";

import SinglePost from "./components/Common/Posts/SinglePost";
import EditPost from "./components/Common/Posts/EditPost";
import FilterPost from "./components/Demo/FilterPost";
import Write from "./components/Home/Write/Write";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      // Set title to 'İzah' when on the homepage
      document.title = "İzah";
    } else {
      // Otherwise, leave title to be updated dynamically (in SinglePost)
    }
  }, [location.pathname]);
  
    const {currentUser} = Blog()
  return (
   <>
   {currentUser ? <HomeHeader/> : <DemoHeader/>}
   <ToastContainer/>
    <Routes>
      {currentUser && <Route path="/" element={<Home/>}/>}
     {!currentUser && <Route path="/demo" element={<Demo/>} />}
     <Route path="/profile/:userId" element={<Profile/>} />
     <Route path="/write" element={<Write />} />
     <Route path="/post/:postId" element={<SinglePost />} />
     <Route path="/editPost/:postId" element={<EditPost />} />
     <Route path="/filter/:tag" element={<FilterPost />} />
     <Route path="*" element={<Navigate to={!currentUser ? "/demo" : "/"} />} />
    </Routes>
    
   </>
   
  )
}

export default App
