import crypto from "crypto";

const algorithm = "aes-256-gcm";

const secret = process.env.API_KEY_ENCRYPTION_SECRET;

if (!secret) {
    throw new Error("Missing API_KEY_ENCRYPTION_SECRET");
}

const key = crypto
    .createHash("sha256")
    .update(secret)
    .digest();

export function encryptApiKey(apiKey: string) {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(apiKey, "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
        iv.toString("base64"),
        authTag.toString("base64"),
        encrypted.toString("base64"),
    ].join(".");
}

export function decryptApiKey(encryptedValue: string) {
    const [ivBase64, authTagBase64, encryptedBase64] =
        encryptedValue.split(".");

    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(ivBase64, "base64")
    );

    decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedBase64, "base64")),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}