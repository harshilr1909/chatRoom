import { useState } from "react";
const loginForm = ({hasAcc,setHasAcc}) => {
    const [pass,setPass] = useState('');
    const [username,setUserName] = useState('');
    const handleSubmit = async(event:any) => {
	event.preventDefault();
	try{
	    const result = await fetch('/new/signin',{
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
		},
		body:JSON.stringify({userName: username,userPass : pass}),
	    });
	    const data = await result.json();
	    console.log(data);
	}catch(err) {
	    console.log(err);
	}
    }

    return (
	<section>
	<div className=" flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
	<div className="form-container w-full bg-white rounded-lg text-black border-2 border-[#cfcfcf] md:mt-0 sm:max-w-md xl:p-0">
	<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
	<h1 className="text-xl font-bold text-black-900 md:text-2xl">
	Log in to your account
	</h1>
	<form className="space-y-4 md:space-y-6"onSubmit={handleSubmit}>
	<div>
	<label htmlFor="username"
	className="block mb-2 text-sm font-medium text-black-900 ">
	Your Username
	</label>
	<input type="text" name="text" id="username" className="border border-gray-300 text-black-90 
	rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
	placeholder="klaus_mikaelson"
	onChange={(e) => {setUserName(e.target.value)}}
	/>
	</div>
	<div>
	<label htmlFor="password"
	className="block mb-2 text-sm font-medium text-black-900">
	Password
	</label>
	<input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" onChange={(e) => {setPass(e.target.value)}}/>
	</div>
	<div className="flex items-center justify-between">
	<div className="flex items-start">
	<div className="flex items-center h-5">
	<input id="remember" aria-describedby="remember" type="checkbox" 
	className="w-4 h-4 border border-gray-300 rounded bg-gray-50 " />
	</div>
	<div className="ml-3 text-sm">
	<label htmlFor="remember"
	className="text-gray-500 dark:text-gray-300">Remember me</label>
	</div>
	</div>
	<a href="#"
	className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
	</div>
	<button type="submit"
	className="w-full text-black bg-[#0c71df] hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
	Log in
	</button>
	<div>
	<p className="text-sm font-light text-gray-500 dark:text-gray-400">
	Don’t have an account yet? 
	<a 
	href="#" className="font-medium text-primary-600 hover:text-black dark:text-primary-500"
	onClick={() => setHasAcc(true)}
	>
	Sign in
	</a>
	</p>
	</div>
	</form>
	</div>
	</div>
	</div>
	</section>
    )
     
}

export default loginForm;
