import { useState, useEffect } from 'react'
import './App.css'
import SigninForm from './components/SigninForm'
import LoginForm from './components/LoginForm.tsx'
import ChatBox from './components/ChatBox.tsx'
import logo from './assets/logo.png'

function App() {
    const [hasAcc,setHasAcc] = useState(false);
    const [signedIn,setSignedIn] = useState(false);
    const [loggedIn,setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetch('/new/login/session')
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('No session');
            })
            .then(data => {
                setSignedIn(true);
                setLoggedIn(true);
                setUserName(data.user);
            })
            .catch(() => {});
    }, []);

    return (
        <div className='container'>
        { signedIn && loggedIn && userName ?
          <ChatBox userName={userName} setSignedIn={setSignedIn} setLoggedIn={setLoggedIn}></ChatBox>
        :
        (
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-6 py-8 mx-auto bg-black min-h-screen">
          <div className="welcome-card w-full bg-gray-900 rounded-lg text-white border-2 border-gray-700 sm:max-w-lg xl:p-0">
          <div className="flex flex-col items-center p-10 space-y-6">
          <img src={logo} alt="logo" className='h-[120px] w-[180px]'/>
          <h1 className="text-3xl font-bold text-center text-white">ChatRoom</h1>
          <p className="text-gray-400 text-center text-base leading-relaxed">
          Connect with friends and colleagues in real-time. Share messages, 
          create groups, and stay in touch with the people who matter most.
          </p>
          </div>
          </div>
          {
          hasAcc ?
          <LoginForm
          hasAcc={hasAcc} setHasAcc={setHasAcc} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUserName={setUserName}>
          </LoginForm>:
          <SigninForm signedIn={signedIn} setSignedIn={setSignedIn} setHasAcc={setHasAcc}></SigninForm>
          }
          </div>
        )
        }
        </div>
    )
}

export default App
