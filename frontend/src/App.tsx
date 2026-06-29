import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import SigninForm from './components/SigninForm'
import LoginForm from './components/LoginForm.tsx'

function App() {
    const [hasAcc,setHasAcc] = useState(false);
  return (
      <div className='container'>
      <Navbar></Navbar>
      {hasAcc ?
	  <SigninForm></SigninForm>:
	  <LoginForm hasAcc={hasAcc} setHasAcc={setHasAcc}></LoginForm>
      }
      </div>
  )
}

export default App
