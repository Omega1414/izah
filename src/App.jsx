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
import Loading from "./components/Loading/Loading";
import { useState } from "react";

function App() {
  moment.locale("az");
  const { currentUser } = Blog(); // Assuming Blog provides loading state or context
  const [loading, setLoading] = useState(false);
  // If `currentUser` or authentication state is still loading, you can show a loader
  if (loading) {
    return <Loading />
  }

  return (
    <>
      {/* Conditional header rendering */}
      {currentUser ? <HomeHeader /> : <DemoHeader />}

      <ToastContainer />

      <Routes>
        {/* Always show the Home page if authenticated, else redirect to /demo */}
        <Route path="/" element={currentUser ? <Home /> : <Navigate to="/demo" />} />

        {/* Redirect to Home if the user is already logged in and tries to visit /demo */}
        <Route path="/demo" element={!currentUser ? <Demo /> : <Navigate to="/" />} />

        {/* Profile page */}
        <Route path="/profile/:userId" element={currentUser ? <Profile /> : <Navigate to="/demo" />} />

        {/* Other pages */}
        <Route path="/write" element={currentUser ? <Write /> : <Navigate to="/demo" />} />
        <Route path="/post/:postId" element={currentUser ? <SinglePost /> : <Navigate to="/demo" />} />
        <Route path="/editPost/:postId" element={currentUser ? <EditPost /> : <Navigate to="/demo" />} />
        <Route path="/filter/:tag" element={currentUser ? <FilterPost /> : <Navigate to="/demo" />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={currentUser ? "/" : "/demo"} />} />
      </Routes>
    </>
  );
}

export default App;
