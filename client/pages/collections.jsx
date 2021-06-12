import { useState, useEffect } from "react";
import { useUser } from "reactfire";
import { db } from "../lib/firebase";

function Collections() {
  const { data: user, error } = useUser();
  useEffect(async () => {
    const userData = await db
      .collection("users")
      .doc(user.uid)
      .collection("likedFonts")
      .get();
    console.log(userData);
  }, []);
  return <div></div>;
}

export default Collections;
