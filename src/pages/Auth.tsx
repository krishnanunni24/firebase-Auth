import { useState } from "react";
import AuthForm from "../components/Auth/AuthForm";
import AuthPageWrap from "../components/Auth/AuthPageWrap";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <AuthPageWrap isSignUp={isSignUp}>
      <AuthForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
    </AuthPageWrap>
  );
}

export default Auth;
