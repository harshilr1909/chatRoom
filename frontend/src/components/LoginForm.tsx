import { useState } from "react";

interface LoginFormProps {
    hasAcc: boolean;
    setHasAcc: (val: boolean) => void;
    loggedIn: boolean;
    setLoggedIn: (val: boolean) => void;
    setUserName: (val: string) => void;
}

const LoginForm = ({hasAcc,setHasAcc,loggedIn,setLoggedIn,setUserName}: LoginFormProps) => {
    const [pass,setPass] = useState('');
    const [username,setLocalUserName] = useState('');
    const [userFound,setUserFound] = useState(true);
    const[wrongPass,setWrongPass] = useState(false);

    const fetchReq = {
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
		},
		body:JSON.stringify({userName: username,userPass : pass}),
	    }

    const fetchURL = '/new/login';

   const handleResponse =  (data:any)=>{
	if(data.message === "Wrong password"){
	   setWrongPass(true); 
	}else if(data.message === "User not found"){
	    setUserFound(false);
	    setLoggedIn(false);	
	}else{
	    setUserName(username);
	    setLoggedIn(true);
	}
    };

    const handleSubmit = async(event: React.FormEvent) => {
	event.preventDefault();
	try{
	    const result = await fetch(fetchURL,fetchReq);
	    const data = await result.json();
	    console.log(data.message);
	    handleResponse(data);
	}catch(err) {
	    console.log(err);
	}
    }

    return (
	<section>
	<div className="form-container w-full bg-black rounded-lg 
	text-white border-2 border-gray-700 sm:max-w-md xl:p-0">
	<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
	<h1 className="text-xl font-bold text-white md:text-2xl">
	Log in to your account
	</h1>
	<form className="space-y-4 md:space-y-6"onSubmit={handleSubmit}>
	<div>
	<label htmlFor="username"
	className="block mb-2 text-sm font-medium text-white ">
	Your Username
	</label>
	<input type="text" name="text" id="username" className="border border-gray-600 text-white bg-gray-800
	rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
	placeholder="klaus_mikaelson"
	onChange={(e) => {setLocalUserName(e.target.value)}}
	/>
	{userFound ? 
	    <p className="text-[#11f568]"></p>: 
	    <p className="text-red-500">Invalid Username</p>
	}
	
	</div>
	<div>
	<label htmlFor="password"
	className="block mb-2 text-sm font-medium text-white">
	Password
	</label>
	<input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" onChange={(e) => {setPass(e.target.value)}}/>
	{wrongPass ? <p className="text-red-500">Invalid Password</p>:
	    <p className="text-[#11f568]"></p>
	}
	</div>
	<a href="#"
	className="text-sm font-medium text-blue-400 hover:underline">Forgot password?</a>
	<button type="submit"
	className="w-full text-white bg-[#0c71df] hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
	Log in
	</button>
	<div>
	<p className="text-sm font-light text-gray-400">
	Don't have an account yet? 
	<a 
	href="#" className="font-medium text-blue-400 hover:text-white"
	onClick={() => setHasAcc(false)}
	>
	Sign in
	</a>
	</p>
	</div>
	</form>
	</div>
	</div>
	</section>
    )
     
}

export default LoginForm;
