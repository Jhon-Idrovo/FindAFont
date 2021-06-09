import * as firebaseAdmin from "firebase-admin";
//this will look for the enviroment variable with the service account
firebaseAdmin.initializeApp();

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
