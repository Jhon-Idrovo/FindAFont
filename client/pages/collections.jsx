import { useState, useEffect, useContext } from "react";
import { db } from "../lib/firebase";
import { UserContext } from "../lib/UserContext";
import useUser from "../hooks/useUser";
import moduleName from "../components/SingIn";
import SingIn from "../components/SingIn";
import SubscriptionNeeded from "../components/SubscriptionNeeded";

function Collections() {
  const { user, logOut } = useUser();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [likedFonts, setLikedFonts] = useState([]);

  return (
    <div>
      {user.subscriptionType ? user.subscriptionType : <SubscriptionNeeded />}
      lkjlkjlkjlkjljk{user?.uid}
      <button onClick={logOut}>Logout</button>
    </div>
  );
}

export default Collections;
