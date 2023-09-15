import { signOut } from "firebase/auth";
import ProfileCard from "../components/profileCard/ProfileCard";
import {useEffect} from "react"
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { auth } from "../config/firebase";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };
 
  useEffect(()=>{
  if(Boolean(!user)){
  navigate("/auth")
  }
  },[navigate,user])
  
  return (
    <div>
     { user && (
       <ProfileCard user={user} handleLogout={handleLogout} />
     )
      }
    </div>
  );
};

export default Profile;
