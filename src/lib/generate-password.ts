import { randomBytes } from "crypto";

export function generateTempPassword(): string {
  return randomBytes(9)
    .toString("base64")
    .replace(/[+/=]/g, "")
    .slice(0, 12);
}
