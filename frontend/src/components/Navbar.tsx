import logo from '../assets/logo.png';
const Navbar = () => { 
    return( 
	   <div className="navbar "> 
	   <img src={logo} alt="logo" className='h-[40px] w-[60px]'/>
	   <a href="#"className="">SignIn</a>
	   <a href="#">login</a>
	   <a href="#">Support</a>
	   <a href="#">Contact</a>
	   </div>
	  )
}

export default Navbar;
