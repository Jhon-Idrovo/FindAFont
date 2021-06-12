import { auth } from "../lib/firebase";
import axios from "axios";

//fetch from server using firebase token. token!=uid
export async function fetchFromAPI(endpointURL, opts) {
  const { body } = opts;
  const API = "https://find-a-font-api.herokuapp.com";
  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await axios.post(
    `${API}/${endpointURL}`,
    body ? { ...body } : {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
