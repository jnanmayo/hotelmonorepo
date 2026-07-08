'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CreateRoomDialog } from '@/features/rooms/components/create-room-dialog';

interface CreateRoomButtonProps {
  onSuccess?: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export function CreateRoomButton({
  onSuccess,
  size = 'sm',
  variant = 'default',
  className,
}: CreateRoomButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size={size} variant={variant} className={className} onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        Create Room
      </Button>
      <CreateRoomDialog open={open} onOpenChange={setOpen} onSuccess={onSuccess} />
    </>
  );
}
