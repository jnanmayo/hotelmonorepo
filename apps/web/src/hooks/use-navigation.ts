'use client';

import { useMemo } from 'react';

import { APP_NAVIGATION, flattenNavigation, type AppRole, type NavItem } from '@/constants/navigation';
import { useAuthStore } from '@/stores/auth.store';

function filterByRoleAndPermission(
  items: NavItem[],
  roles: string[],
  permissions: string[],
  isSuperAdmin: boolean,
): NavItem[] {
  return items
    .filter((item) => {
      if (isSuperAdmin) return true;
      if (item.roles && !item.roles.some((r) => roles.includes(r))) return false;
      if (item.permission && !permissions.includes(item.permission) && !permissions.includes('dashboard:overview:read')) {
        if (item.permission && permissions.length > 0 && !permissions.includes(item.permission)) {
          return false;
        }
      }
      return true;
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? filterByRoleAndPermission(item.children, roles, permissions, isSuperAdmin)
        : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
}

export function useNavigation(roleOverride?: AppRole) {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    const roles = roleOverride ? [roleOverride] : (user?.roles ?? ['HOTEL_OWNER']);
    const permissions = user?.permissions ?? [];
    const isSuperAdmin = roles.includes('SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN');

    if (!user?.permissions?.length) {
      return APP_NAVIGATION;
    }

    return filterByRoleAndPermission(APP_NAVIGATION, roles, permissions, !!isSuperAdmin);
  }, [user, roleOverride]);
}

export function useFlatNavigation(roleOverride?: AppRole) {
  const nav = useNavigation(roleOverride);
  return useMemo(() => flattenNavigation(nav), [nav]);
}
