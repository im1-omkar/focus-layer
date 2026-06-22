import React, {  useState } from 'react'
import { handleSignin, handleSignup } from '../services/signup'
import { useMutation } from '@tanstack/react-query'

const Auth = () => {
  
  const [signin, isSignin] = useState<boolean>(true)
  const [email, setEmail] = useState<string | null>('')
  const [password, setPassword] = useState<string | null>('')
  const [name, setName] = useState<string | null>('')
  const [message, setMessage] = useState('message')

  const signupMutation = useMutation({
    mutationFn : handleSignup,

    onSuccess : (data)=>{
      setMessage(JSON.stringify(data));
    },

    onError : ()=>{
      setMessage("signup failled")
    }
  })

  const signinMutation = useMutation({
    mutationFn : handleSignin,

    onSuccess : (data)=>{
      setMessage(JSON.stringify(data))
      localStorage.setItem('token',data.token)
    },

    onError : ()=>{
      setMessage('signin faillled')
    }
  })

  // const signUpHandler = async()=>{
  //   const result =  await handleSignup({ name, email, password })
  //   if (result){
  //     setMessage(JSON.stringify(result))
  //     return;
  //   }
  //   setMessage("signup faillll")
  // }

  // const signInHandler = async()=>{
  //   const result = await handleSignin({ email, password })
  //   if (result){
  //     setMessage(JSON.stringify(result.token))
  //     localStorage.setItem("token",result.token)
  //     return;
  //   }
  //   setMessage("signininnn faillll")
  // }

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='border w-100 h-100 flex flex-col items-center'>
        <div className='w-full flex '>
          <button className='flex-1 border' onClick={() => { isSignin(true) }}>signin</button>
          <button className='flex-1 border' onClick={() => { isSignin(false) }}>signup</button>
        </div>
        {
          signin ? <div className='flex flex-col'>
            <input onChange={(e: React.ChangeEvent<HTMLInputElement >)=>{setEmail(e.target.value)}} className='border m-3' placeholder='email'/>
            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }} type="password" className='border m-3' placeholder='password'/>
            <button onClick={()=>{
              signinMutation.mutate({
                email,
                password
              })
            }} className='bg-green-400 border'>
              {signinMutation.isPending? 'Loading...' : 'Signin'}
            </button>
          </div> : 
          <div className='flex flex-col'>
            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }} className='border m-3' placeholder='name'/>
            <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setEmail(e.target.value)}} className='border m-3' placeholder='email'/>
              <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }} type="password" className='border m-3' placeholder='password' />
            <button onClick={() => {
              signupMutation.mutate({
                name,
                email,
                password
              })
            }} className='bg-green-400 border'>{signupMutation.isPending ? 'Loading' : 'signup'}</button>
          </div>
        }
        <div>{message}</div>
      </div>
    </div>
  )
}

export default Auth;
