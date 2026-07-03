'use client';

import { useMemo } from 'react';

import {
  CMS_NAVIGATION,
  flattenCmsNavigation,
  type CmsNavItem,
  type CmsRole,
} from '@/features/cms/constants/cms-navigation';
import { useAuthStore } from '@/stores/auth.store';

function filterCmsByRole(items: CmsNavItem[], roles: string[], isSuperAdmin: boolean): CmsNavItem[] {
  return items
    .filter((item) => {
      if (isSuperAdmin) return true;
      if (item.roles && !item.roles.some((r) => roles.includes(r))) return false;
      return true;
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterCmsByRole(item.children, roles, isSuperAdmin) : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
}

export function useCmsNavigation(roleOverride?: CmsRole) {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    const roles = roleOverride ? [roleOverride] : (user?.roles ?? ['HOTEL_OWNER']);
    const isSuperAdmin = roles.includes('SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN');
    return filterCmsByRole(CMS_NAVIGATION, roles, !!isSuperAdmin);
  }, [user, roleOverride]);
}

export function useFlatCmsNavigation(roleOverride?: CmsRole) {
  const nav = useCmsNavigation(roleOverride);
  return useMemo(() => flattenCmsNavigation(nav), [nav]);
}
