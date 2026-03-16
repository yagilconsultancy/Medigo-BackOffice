import { cookies } from 'next/headers';

export async function getCookies() {
  const cookie = (await cookies()).get('userToken')?.value;
  return cookie;
}
