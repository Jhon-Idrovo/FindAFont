import { auth } from "../lib/firebase";
import axios from "axios";

export async function fetchCheckout(priceId) {
  const API = "http://localhost:3333";
  const user = auth.currentUser;
  const token = user && (await user.getIdToken());
  const res = await fetch(`${API}/checkout`, {
    method: "POST",
    body: JSON.stringify({ priceId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
//fetch from server using firebase token
export async function fetchFromAPI(endpointURL, opts) {
  const { body } = opts;
  const API = "http://localhost:3333";
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
