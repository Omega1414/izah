import React from 'react';
import './loading.css';

const Loading = () => {
  return (
    <div className="fixed inset-0 grid place-items-center bg-white dark:bg-black z-30">
      <div className="loader"></div> {/* The loader itself */}
    </div>
  );
};

export default Loading;
