import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../lib/firebase";
import firebase from "firebase/app";

const uiConfig = {
  signInFlow: "popup",

  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    //avoid redirects
    signInSuccessWithAuthResult: () => false,
  },
};
function FirebaseAuth() {
  return (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
}

export default FirebaseAuth;
