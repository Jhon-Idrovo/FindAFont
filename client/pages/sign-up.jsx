import FirebaseAuth from "../components/FirebaseAuth";
import PlanSelection from "../components/PlanSelection";

function SignUp() {
  return (
    <div>
      <p>Sign In with you prefered account</p>
      <FirebaseAuth />
      <PlanSelection />
    </div>
  );
}

export default SignUp;
