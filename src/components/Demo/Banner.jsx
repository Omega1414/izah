import React from 'react'

const Banner = () => {
  return (
    <div className='bg-banner border-b border-black'>
        <div className='size py-[5rem] flex flex-col items-start gap-[1rem]'>
            <h1 className='font-title text-[3rem] sm:text-[4rem] md:text-[6rem] font-normal'>İzah et.</h1>
            <p className='w-full md:w-[30rem] text-[1.3rem] md:text-[1.5rem] font-medium leading-7'>
                Mariflən, marifləndir.
            </p>
            <button className='btn bg-black1 rounded-full text-white !text-[1.2rem] !px-6 !mt-[2.5rem]'>Start Reading</button>
        </div>
    </div>
  )
}

export default Banner