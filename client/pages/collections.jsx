import { useState, useEffect } from "react";
import { useUser, preloadUser } from "reactfire";
import { db } from "../lib/firebase";

async function getUserLikedFonts() {
  const { uid } = await preloadUser();
  console.log(uid);

  const userData = await db
    .collection("users")
    .doc(uid)
    .collection("likedFonts")
    .get();
  console.log(userData);
}

function Collections() {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [likedFonts, setLikedFonts] = useState([]);
  preloadUser().then((userData) => {
    console.log(userData);
    const collection = db
      .collection("users")
      .doc(userData.uid)
      .collection("likedFonts")
      .get()
      .then((collection) => {
        console.log(collection);
        //   collection.forEach(doc=>)
      })
      .catch((err) => console.log(err));
  });

  return <div>lkjlkjlkjlkjljk</div>;
}

export default Collections;
