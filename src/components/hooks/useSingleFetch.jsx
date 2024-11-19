import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

const useSingleFetch = (collectionName, id, subCol) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id || !subCol) return;

    // Construct a query reference for the subcollection
    const postRef = query(collection(db, collectionName, id, subCol));

    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(fetchedData);
      } else {
        setData([]); // Return empty if no data is found
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data: ", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener when component unmounts
  }, [collectionName, id, subCol]);

  return {
    data,
    loading,
  };
};

export default useSingleFetch;