/** Generates a random 6-character alphanumeric room code. */
export function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

