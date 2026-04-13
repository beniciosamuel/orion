import argon2 from "argon2";

export class Password {
  async encrypt(plainPassword: string): Promise<string> {
    try {
      const hash = await argon2.hash(plainPassword, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });
      return hash;
    } catch (error) {
      throw new Error(`Failed to encrypt password: ${error}`, {
        cause: error,
      });
    }
  }
  async verify(hash: string, plainPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainPassword);
    } catch (error) {
      throw new Error(`Failed to verify password: ${error}`, {
        cause: error,
      });
    }
  }
}
