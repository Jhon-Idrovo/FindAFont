import { db } from "../lib/firebase";

export async function parseUser(user) {
  const { uid } = user;
  try {
    const subscription = await db
      .collection("users")
      .doc(uid)
      .collection("private")
      .doc("subscription")
      .get();
    console.log(subscription.data());
    return { ...user, ...subscription.data() };
  } catch (e) {
    console.log(e);
    return { ...user, subscriptionType: false };
  }
}
export async function saveUserToFirestore(user) {
  try {
    const { uid, email, displayName: name } = user;
    await db.collection("users").doc(uid).set({ email, name }, { merge: true });
  } catch (e) {
    console.log("An error happened while saving the user to Firestore", e);
  }
}
