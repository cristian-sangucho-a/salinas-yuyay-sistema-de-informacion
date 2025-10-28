import PocketBase from 'pocketbase';

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

if (!POCKETBASE_URL) {
    throw new Error('Please define NEXT_PUBLIC_POCKETBASE_URL in your .env file');
}

export const pocketbase = new PocketBase(POCKETBASE_URL);