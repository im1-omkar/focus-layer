import React, { useState } from 'react'

const Auth = () => {
  const [signin, isSignin] = useState<boolean>(true)
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='border w-100 h-100 flex flex-col items-center'>
        <div className='w-full flex '>
          <button className='flex-1 border' onClick={() => { isSignin(!signin) }}>signin</button>
          <button className='flex-1 border' onClick={() => { isSignin(!signin) }}>signup</button>
        </div>
        {
          signin ? <div className='flex flex-col'>
            <input placeholder='email'/>
            <input placeholder='password'/>
            <button className='bg-green-400 border'>SignIn</button>
          </div> : 
          <div className='flex flex-col'>
            <input placeholder='name'/>
            <input placeholder='email'/>
            <input placeholder='password' />
              <button className='bg-green-400 border'>Signup</button>
          </div>
        }
      </div>
    </div>
  )
}

export default Auth