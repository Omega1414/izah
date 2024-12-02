import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

const useSingleFetch = (collectionName, id, subCol) => {
  const [data, setData] = useState([]); // Ensuring data is an array by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Adding error state to handle fetch issues

  useEffect(() => {
    if (!id || !subCol) {
      setLoading(false); // If no id or subCol, don't try to fetch anything
      return;
    }

    // Construct the query for the subcollection
    const postRef = query(collection(db, collectionName, id, subCol));

    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(fetchedData); // Set fetched data
      } else {
        setData([]); // If no data, set as empty array
      }
      setLoading(false);
    }, (error) => {
      setError(error); // Handle fetch error
      console.error("Error fetching data: ", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [collectionName, id, subCol]);

  // Return data, loading state, and any potential errors
  return {
    data,
    loading,
    error,
  };
};

export default useSingleFetch;