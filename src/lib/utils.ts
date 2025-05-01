import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats time in seconds to MM:SS format.
 * @param seconds - Time in seconds.
 * @returns Formatted time string (MM:SS).
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}


/**
 * Shuffles an array in place using the Fisher-Yates (Knuth) algorithm with Math.random().
 * @param array - The array to shuffle.
 */
export function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

// --- Seeded Shuffle Logic ---

/**
 * Simple Mulberry32 PRNG.
 * @param seed - The initial seed number.
 * @returns A function that generates pseudo-random numbers between 0 (inclusive) and 1 (exclusive).
 */
function mulberry32(seed: number) {
    return function() {
      var t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Creates a numeric hash from a string. Used to convert string seeds to numbers for the PRNG.
 * cyrb53 (c) 2018 bryc (github.com/bryc)
 * @param str - The input string.
 * @param seed - An optional initial seed number.
 * @returns A 53-bit numeric hash.
 */
function cyrb53(str: string, seed = 0): number {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    // Combine the two 32-bit hashes to get a larger hash value.
    // Use 4294967296 (2^32) to shift h2 and combine. Ensure it fits within 53 bits.
    return (h2 >>> 0) * 0x100000 + (h1 >>> 0); // Simplified combination for reasonable distribution
}


/**
 * Shuffles an array based on a seed using the Fisher-Yates (Knuth) algorithm and Mulberry32 PRNG.
 * Returns a new shuffled array, does not modify the original.
 * @param array - The array to shuffle.
 * @param seed - A seed (string or number) to ensure deterministic shuffling for the same seed.
 */
export function seededShuffleArray<T>(array: T[], seed: string | number): T[] {
    const numericSeed = typeof seed === 'string' ? cyrb53(seed) : seed;
    const random = mulberry32(numericSeed);
    const shuffled = [...array]; // Create a copy to avoid modifying the original array
    let currentIndex = shuffled.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element using the seeded PRNG.
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [shuffled[currentIndex], shuffled[randomIndex]] = [
            shuffled[randomIndex], shuffled[currentIndex]
        ];
    }

    return shuffled;
}

/**
 * Gets the current date as a string in YYYY-MM-DD format.
 * Ensures consistent seeding for the day.
 * @returns The current date string.
 */
export function getCurrentDateSeed(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
