import { auth } from "../lib/firebase";

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
