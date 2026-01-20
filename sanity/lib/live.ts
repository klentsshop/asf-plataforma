import { defineLive } from "next-sanity/live";
import { client } from './client';

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Next.js detectará automáticamente las variables del .env.local
  serverToken: process.env.SANITY_API_READ_TOKEN || false,
  browserToken: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN || false,
});