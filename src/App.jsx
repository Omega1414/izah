import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Demo from "./components/Demo/Demo";
import DemoHeader from "./components/Demo/DemoHeader";
import Context, { Blog } from "./Context/Context";
import { ToastContainer } from "react-toastify";
import HomeHeader from "./components/Home/Header/HomeHeader";
import Profile from "./components/Home/Profile/Profile";
import moment from "moment";
import "moment/locale/az";
import SinglePost from "./components/Common/Posts/SinglePost";
import EditPost from "./components/Common/Posts/EditPost";
import FilterPost from "./components/Demo/FilterPost";
import Write from "./components/Home/Write/Write";

function App() {
  moment.locale("az");
  const { currentUser } = Blog();

  return (
    <>
      {/* Conditional header rendering */}
      {currentUser ? <HomeHeader /> : <DemoHeader />}

      <ToastContainer />

      <Routes>
        {/* Route to Home or Demo based on currentUser */}
        <Route path="/" element={currentUser ? <Home /> : <Navigate to="/demo" />} />
        
        {/* Demo route if no user */}
        <Route path="/demo" element={!currentUser ? <Demo /> : <Navigate to="/" />} />
        
        {/* Profile page */}
        <Route path="/profile/:userId" element={<Profile />} />
        
        {/* Other pages */}
        <Route path="/write" element={<Write />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/editPost/:postId" element={<EditPost />} />
        <Route path="/filter/:tag" element={<FilterPost />} />

        {/* Catch-all route to redirect users to appropriate pages */}
        <Route path="*" element={<Navigate to={!currentUser ? "/demo" : "/"} />} />
      </Routes>
    </>
  );
}

export default App;
