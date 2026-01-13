export async function fetchConversations(token) {
  const res = await fetch(
    `http://127.0.0.1:8000/api/conversations?token=${token}`
  );

  if (!res.ok) {
    throw new Error("Failed to load conversations");
  }

  return res.json();
}
