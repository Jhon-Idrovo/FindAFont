export async function fetchCheckout(priceId) {
  const API = "http://localhost:3333";

  const res = await fetch(`${API}/checkout`, {
    method: "POST",
    body: JSON.stringify({ priceId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
