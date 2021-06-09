import firebase from "firebase/app";
import { auth, db } from "../lib/firebase";

function SingIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  //const provider = new auth.GoogleAuthProvider()

  const singInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      console.log(result.user);
      const { uid, email, displayName: name } = result.user;
      //saving the user to firestore
      db.collection("users").doc(uid).set({ email, name }, { merge: true });
    } catch (error) {
      console.log("An error happened in the sing in process", error);
    }
  };

  return (
    <div>
      <button onClick={singInWithGoogle}>Sing in With Google</button>
    </div>
  );
}

export default SingIn;
