import React, { useEffect, useRef } from 'react'

const Dropdown = ({ children, size, showDrop, setShowDrop }) => {
  const dropRef = useRef(null)

  useEffect(() => {
    const clickOutside = (e) => {
      if (showDrop && dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDrop(false)
      }
    }
    window.addEventListener("mousedown", clickOutside)
    return () => window.removeEventListener("mousedown", clickOutside)
  }, [showDrop])

  return (
    <>
      {showDrop && (
        <div
          ref={dropRef}
          className={`shadows flex flex-col absolute right-0 top-[2rem] bg-white ${size} z-[999]`}
        >
          {children}
        </div>
      )}
    </>
  )
}

export default Dropdown
