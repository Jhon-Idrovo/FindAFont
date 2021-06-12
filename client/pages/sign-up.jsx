import SingIn from "../components/SingIn";
import PlanSelection from "../components/PlanSelection";
import { AuthCheck, useUser } from "reactfire";

function SignUp() {
  const { status, data: user } = useUser();

  return (
    <div>
      <SingIn />
      <PlanSelection />
    </div>
  );
}

export default SignUp;
