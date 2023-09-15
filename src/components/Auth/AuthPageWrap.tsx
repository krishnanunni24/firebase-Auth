import React, { ReactNode } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useAppDispatch } from "../../hooks/storeHook";
import { login } from "../../features/authSlice";

type props = {
  isSignUp: boolean;
  children: ReactNode;
};
const AuthPageWrap: React.FC<props> = ({ isSignUp, children }) => {
  const dispatch = useAppDispatch();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log("google data of user:", user);
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoURL: user.photoURL || null,
          })
        );
    } catch (err: any) {
      console.log("error sign in with google:",err)
    }
  };
  return (
    <div>
      <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
        <div className="md:w-1/3 max-w-sm">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Sample image"
          />
        </div>
        <div className="md:w-1/3 max-w-sm">
          <div className="text-center md:text-left">
            <label className="mr-1">
              {isSignUp ? "Sign Up" : "Sign in"} with
            </label>
        
            <button
              onClick={signInWithGoogle}
              type="button"
              className="inline-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
            >
              <svg
                style={{ color: "white" }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-google m-auto"
                viewBox="0 0 16 16"
              >
                <path
                  d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                  fill="white"
                ></path>
              </svg>
            </button>
          </div>
          <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
              Or
            </p>
          </div>

          {children}
        </div>
      </section>
    </div>
  );
};

export default AuthPageWrap;
