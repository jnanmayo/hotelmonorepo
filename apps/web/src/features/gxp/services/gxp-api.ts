import axios from 'axios';

import { env } from '@/lib/env';
import { GXP_PUBLIC_API, GXP_SESSION_HEADER } from '@/features/gxp/constants/gxp-navigation';

/** Guest portal API — no staff JWT; uses X-Guest-Session header */
export function createGxpClient(sessionToken: string) {
  return axios.create({
    baseURL: env.apiUrl,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
      [GXP_SESSION_HEADER]: sessionToken,
    },
    withCredentials: true,
  });
}

export async function createGuestSession(input: { qrToken?: string; reservationCode?: string; lastName?: string }) {
  const res = await axios.post<{ data: { sessionToken: string } }>(
    `${env.apiUrl}${GXP_PUBLIC_API.session}`,
    input,
    { withCredentials: true },
  );
  return res.data.data;
}

export async function validateGuestSession(sessionToken: string) {
  const res = await axios.get(`${env.apiUrl}${GXP_PUBLIC_API.validate}`, {
    headers: { [GXP_SESSION_HEADER]: sessionToken },
    withCredentials: true,
  });
  return res.data.data;
}
