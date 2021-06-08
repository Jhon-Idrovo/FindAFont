import firebase from "firebase/app";
import { auth, db } from "../lib/firebase";
function SingIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  //const provider = new auth.GoogleAuthProvider()

  const singInWithGoogle = async () => {
    //TODO handle errors
    const result = await auth.signInWithPopup(provider);
    const { uid, email } = result.user;
    //saving the user to firestore
    db.collection("users").doc(uid).set({ email }, { merge: true });
  };
  // auth
  // .signInWithPopup(provider)
  // .then((result) => {
  //   /** @type {firebase.auth.OAuthCredential} */
  //   var credential = result.credential;

  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   var token = credential.accessToken;
  //   // The signed-in user info.
  //   var user = result.user;
  //   // ...
  // })
  // .catch((error) => {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   // The email of the user's account used.
  //   var email = error.email;
  //   // The firebase.auth.AuthCredential type that was used.
  //   var credential = error.credential;
  //   // ...
  // });

  return <div></div>;
}

export default SingIn;
