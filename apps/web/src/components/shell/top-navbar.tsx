'use client';

import {
  Bell,
  Building2,
  ChevronDown,
  Cloud,
  Globe,
  LogOut,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/common/logo';
import { MobileMenuButton } from '@/components/shell/app-sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES } from '@/constants/routes';
import { authService } from '@/features/auth/services/auth.service';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences.store';
import { useShellStore } from '@/stores/shell.store';
import { useTheme } from '@/providers/theme-provider';
import Link from 'next/link';

interface TopNavbarProps {
  hotelName?: string;
  userName?: string;
  userInitials?: string;
  userRole?: string;
  className?: string;
}

export function TopNavbar({
  hotelName = 'Tunga International',
  userName = 'Hotel Admin',
  userInitials = 'HA',
  userRole = 'Hotel Owner',
  className,
}: TopNavbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const language = usePreferencesStore((s) => s.language);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const setCommandOpen = useShellStore((s) => s.setCommandPaletteOpen);
  const setNotifOpen = useShellStore((s) => s.setNotificationPanelOpen);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        }).format(new Date()),
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-sticky flex h-16 items-center gap-3 border-b bg-card px-4 shadow-nav lg:gap-4 lg:px-6',
        className,
      )}
    >
      <MobileMenuButton />
      <Logo variant="mark" size="sm" className="hidden shrink-0 md:flex lg:hidden" />

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        className="relative hidden max-w-md flex-1 md:flex"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          readOnly
          placeholder="Search... Ctrl+K"
          className="h-10 cursor-pointer pl-9"
        />
      </button>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden gap-2 lg:flex">
              <Building2 className="h-4 w-4" />
              <span className="max-w-[140px] truncate">{hotelName}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Hotel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{hotelName}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="hidden text-xs text-muted-foreground xl:inline">{time} IST</span>
        <span className="hidden items-center gap-1 text-xs text-muted-foreground lg:flex">
          <Cloud className="h-3.5 w-3.5" /> 28°C Mumbai
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Language">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>English {language === 'en' && '✓'}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('hi')}>Hindi</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon-sm" aria-label="Messages">
          <MessageSquare className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label="Notifications"
          onClick={() => setNotifOpen(true)}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-white">
            2
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden flex-col items-start text-left md:flex">
                <span className="text-sm font-medium leading-none">{userName}</span>
                <span className="text-caption">{userRole}</span>
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 opacity-50 md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p>{userName}</p>
              <p className="text-xs font-normal text-muted-foreground">{userRole} · {hotelName}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={asRoute('/app/settings')}><Settings className="mr-2 h-4 w-4" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem><Shield className="mr-2 h-4 w-4" /> Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={async () => {
                await authService.logout();
                router.replace(AUTH_ROUTES.login);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
