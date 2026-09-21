import crypto from "crypto";

function generateCode() {
  const mainString = crypto.randomBytes(12).toString("base64url");

  let shortCode = "";

  for (let i = 0; i < 6; i++) {
    shortCode += mainString.charAt(Math.floor(Math.random() * 16));
  }

  return shortCode;
}

export default generateCode;
