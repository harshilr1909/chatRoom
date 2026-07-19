import { useState } from "react";

interface SigninFormProps {
    signedIn: boolean;
    setSignedIn: (val: boolean) => void;
    setHasAcc: (val: boolean) => void;
}

const SigninForm = ({signedIn,setSignedIn,setHasAcc}: SigninFormProps) => {
    const [email,setEmail] = useState('');
    const [pass,setPass] = useState('');
    const [username,setUserName] = useState('');
    const [userExists,setUserExists] = useState(false);
    const [emailExists,setEmailExists] = useState(false);
    const [passExists,setPassExists] = useState(false);

    const fetchReq = {
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
		},
		body:JSON.stringify({userEmail: email , userPass : pass, userName: username}),
	    }

    const fetchURL = '/new/signin';

    const handleResponse = (data:any) => {
	if(data.errno === 1062){
	    if(data.sqlMessage?.includes("emailid")){
	    setEmailExists(true);
	    console.log(data.sqlMessage);
	    }
	    else if(data.sqlMessage?.includes("password")){
	    setPassExists(true);
	    console.log(data.sqlMessage);
	    }else{
	    setUserExists(true);
	    console.log(data.sqlMessage);
	    }
	}else if(data.errno === 1048){
	    console.log(data.message);
	}else{
	    console.log(data);
	    setSignedIn(true);
	}
    }

    const handleSubmit = async(event: React.FormEvent) => {
	event.preventDefault();
	console.log("submitting");
	try{
	    const result = await fetch(fetchURL,fetchReq);
	const data = await result.json();
	handleResponse(data);
	}catch(err) {
	    console.log(err);
	}
    }

    return (
	<section>
	<div className="form-container w-full bg-black rounded-lg text-white border-2 border-gray-700 sm:max-w-md xl:p-0">
	<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
	<h1 className="text-xl font-bold text-white md:text-2xl">
	Sign in to your account
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
	onChange={(e) => {setUserName(e.target.value)}}
	/>
	{
	    userExists ? <p className="text-red-500">User already Exists</p> : 
	    <p className="text-[#11f568]"></p>
	}
	</div>
	<div>
	<label htmlFor="email"
	className="block mb-2 text-sm font-medium text-white ">
	Your email
	</label>
	<input type="email" name="email" id="email" className="border border-gray-600 text-white bg-gray-800
	rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
	placeholder="name@company.com"
	onChange={(e) => {setEmail(e.target.value)}}
	/>
	{
	    emailExists ? <p className="text-red-500">Email already Exists</p> : 
	    <p className="text-[#11f568]"></p>
	}
	</div>
	<div>
	<label htmlFor="password"
	className="block mb-2 text-sm font-medium text-white">
	Password
	</label>
	<input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" onChange={(e) => {setPass(e.target.value)}}/>
	{
	    passExists ? <p className="text-red-500">Please enter a strong password</p> : 
	    <p className="text-[#11f568]"></p>
	}
	</div>
	<a href="#"
	className="text-sm font-medium text-blue-400 hover:underline">Forgot password?</a>
	<button type="submit"
	className="w-full text-white bg-[#0c71df] hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
	Sign in
	</button>
	<div>
	<p className="text-sm font-light text-gray-400">
	Already have an account? 
	<a 
	href="#" className="font-medium text-blue-400 hover:text-white"
	onClick={() => setHasAcc(true)}
	>
	Log in
	</a>
	</p>
	</div>
	</form>
	</div>
	</div>
	</section>
    )
}

export default SigninForm
