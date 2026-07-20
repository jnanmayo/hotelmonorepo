'use client';

import { useMemo } from 'react';

import {
  APP_NAVIGATION,
  flattenNavigation,
  type AppRole,
  type NavItem,
} from '@/constants/navigation';
import { useAuthStore } from '@/stores/auth.store';

function filterByRole(
  items: NavItem[],
  roles: string[],
  isSuperAdmin: boolean,
  isChild: boolean = false,
): NavItem[] {
  return items
    .filter((item) => {
      if (isSuperAdmin) return true;
      // Children inherit parent access — no need for their own role check
      if (isChild) return true;
      // Top-level items: must have roles that match the user
      if (!item.roles) return false;
      if (!item.roles.some((r) => roles.includes(r))) return false;
      return true;
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterByRole(item.children, roles, isSuperAdmin, true) : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
}
export function getDefaultRouteForRoles(roles: string[]): string | null {
  const isSuperAdmin = roles.includes('SUPER_ADMIN');

  for (const item of APP_NAVIGATION) {
    if (isSuperAdmin) {
      if (item.href) return item.href;
      continue;
    }

    if (item.roles && item.roles.some((r) => roles.includes(r))) {
      if (item.href) return item.href;
    }
  }

  const fallback = APP_NAVIGATION.find((item) => item.href);
  return fallback?.href ?? null;
}
export function useNavigation(roleOverride?: AppRole) {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    const roles = roleOverride ? [roleOverride] : (user?.roles ?? ['HOTEL_OWNER']);
    const isSuperAdmin = roles.includes('SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN');

    return filterByRole(APP_NAVIGATION, roles, !!isSuperAdmin);
  }, [user, roleOverride]);
}

export function useFlatNavigation(roleOverride?: AppRole) {
  const nav = useNavigation(roleOverride);
  return useMemo(() => flattenNavigation(nav), [nav]);
}
