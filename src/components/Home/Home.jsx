import React from 'react'
import Posts from '../Common/Posts/Posts'
import Follow from './UserToFollow/Follow'
import FloatingSidebar from './FloatingSidebar'

const Home = () => {
  return (
    <section className='size flex lg:gap-[5rem] relative'>
      <div className='flex-[2] py-10 mb-[4rem] items-center justify-center'>
        <Posts />
      </div>
      <div className='hidden xl:inline-block xl:w-[23rem] p-7 border-1 border-gray-300'> 
        <h3 className='dark:text-blue-300'>Aktiv istifadəçilər</h3>
        <Follow />

        <FloatingSidebar />
      </div>
     
    </section>
  )
}

export default Home