import React, { useEffect, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { login } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

type AuthFormProps = {
  isSignUp: boolean;
  setIsSignUp: (val: boolean | ((prevVar: boolean) => boolean)) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp, setIsSignUp }) => {
  type LoginFormValues = {
    password: string;
    email: string;
    confirmPassword: string;
  };
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const {user}=useAppSelector((state)=>state.auth)

  useEffect(()=>{
 if(Boolean(user)){
  navigate("/")
 }
  },[user,navigate])
   

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginFormValues>();

  const handleRegister = () => {
    reset();
    setErrorMessage(null)
    setIsSignUp((prevState) => !prevState);
  };

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit: SubmitHandler<LoginFormValues> = async (
    data: FieldValues
  ) => {
    const { email, password } = data;
    setLoading(true)
    if (isSignUp) {
      //Sign up
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("user:", user);
        await setDoc(doc(db, "users", user.uid), { email });
        setLoading(false);
        if (user && user.email)
          dispatch(
            login({
              email: user.email,
              id: user.uid,
              photoURL: user.photoURL || null,
            })
          );
      } catch (err: any) {
        setLoading(false);
        const errCode = err.code;
        setErrorMessage(errCode);
      }
    } else {
      //Sign in
      try{
        const {user}=await signInWithEmailAndPassword(auth,email,password)
        console.log("logging in user:",user)
        setLoading(false)
        if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoURL: user.photoURL || null,
          })
        );
      }catch(err:any){
       setLoading(false)
       const errCode=err.code;
       setErrorMessage(errCode)
      }

    }

    reset();
  };



  return (
    <>
      {/* Form inputs */}
      {errorMessage && (
        <p className="bg-red-400 px-3 py-3 text-center rounded-md text-white">
          {errorMessage}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Email must be Valid!",
            },
          })}
          name="email"
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="text"
          placeholder="Email Address"
        />
        {errors?.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        <input
          {...register("password", {
            required: "Password is required",
            maxLength: {
              value: 15,
              message: "Password should be a maximum of 15 characters",
            },
            minLength: {
              value: 8,
              message: "Password should contain at least 8 characters",
            },
          })}
          name="password"
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
        />
        {errors?.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
        {isSignUp && (
          <>
            <input
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password.current || "The passwords do not match",
              })}
              name="confirmPassword"
              className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
              type="password"
              placeholder="Confirm Password"
            />
            {errors?.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </>
        )}

        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded mt-4 hover:bg-blue-700"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <span
          onClick={handleRegister}
          className="text-red-600 hover:underline hover:underline-offset-4 ml-1"
        >
          {isSignUp ? "Login" : "Register"}
        </span>
      </div>
    </>
  );
};

export default AuthForm;
