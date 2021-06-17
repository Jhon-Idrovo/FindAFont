import { auth, db } from "../lib/firebase";
import useUser from "./useUser";

import { useEffect, useState } from "react";

export default function useCollections() {
  const { user } = useUser();
  const [collections, setCollections] = useState();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections = await db
          .collection("users")
          .doc(user.uid)
          .collection("likedFonts")
          .get();
        console.log(collections);
        const docs = collections.docs.map((doc) => doc.data());
        setCollections(docs);
      } catch (e) {
        setIsError(true);
        console.log("An error happened while fetching the collections", e);
      }
    };
    //wait until the user is defined
    user ? fetchCollections() : null;
  }, [user]);

  return { collections, isError };
}
