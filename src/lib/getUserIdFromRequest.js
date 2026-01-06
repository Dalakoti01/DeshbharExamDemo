import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromRequest() {
  try {
    // ✅ Now await cookies()
    const cookieStore = await cookies();
    const customToken = cookieStore.get("token")?.value;

    if (!customToken) return null;

    const decoded = jwt.verify(customToken, process.env.JWT_SECRET);

    return decoded.userId || null;
  } catch (err) {
    console.error("Invalid or expired JWT:", err.message);
    return null;
  }
}
