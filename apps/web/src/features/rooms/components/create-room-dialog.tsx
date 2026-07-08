'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { notifyRoomCreated } from '@/features/rooms/constants/room-events';
import { ROOMS_API } from '@/features/rooms/constants/room-navigation';
import { apiClient } from '@/services/api-client';

import type { CreateRoomSchema, RoomInventory } from '@tungaos/shared';

const CATEGORIES = ['STANDARD', 'DELUXE', 'SUITE', 'VILLA', 'COTTAGE', 'PRESIDENTIAL'] as const;

const EMPTY_FORM = {
  floorId: '',
  roomTypeId: '',
  roomNumber: '',
  category: 'STANDARD' as CreateRoomSchema['category'],
  isSmoking: false,
  isAccessible: false,
  notes: '',
};

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRoomDialog({ open, onOpenChange, onSuccess }: CreateRoomDialogProps) {
  const [inventory, setInventory] = useState<RoomInventory | null>(null);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadInventory = useCallback(() => {
    setLoadingInventory(true);
    apiClient
      .get<{ data: RoomInventory }>(ROOMS_API.inventory)
      .then((r) => setInventory(r.data.data))
      .catch(() => toast.error('Failed to load property setup'))
      .finally(() => setLoadingInventory(false));
  }, []);

  useEffect(() => {
    if (open) {
      loadInventory();
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, loadInventory]);

  const floors = useMemo(
    () =>
      (inventory?.buildings ?? []).flatMap((building) =>
        building.floors.map((floor) => ({
          id: floor.id,
          label: `${building.name} · Floor ${floor.floorNumber} — ${floor.name}`,
        })),
      ),
    [inventory],
  );

  const roomTypes = inventory?.roomTypes ?? [];
  const canCreate = floors.length > 0 && roomTypes.length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate) return;

    setSubmitting(true);
    try {
      const payload: CreateRoomSchema = {
        floorId: form.floorId,
        roomTypeId: form.roomTypeId,
        roomNumber: form.roomNumber.trim(),
        category: form.category,
        isSmoking: form.isSmoking,
        isAccessible: form.isAccessible,
        notes: form.notes.trim() || undefined,
      };
      await apiClient.post(ROOMS_API.list, payload);
      toast.success(`Room ${payload.roomNumber} created`);
      onOpenChange(false);
      notifyRoomCreated();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message ?? 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>Add a new room to your property inventory.</DialogDescription>
        </DialogHeader>

        {loadingInventory ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading property setup…</p>
        ) : !canCreate ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {floors.length === 0 && roomTypes.length === 0
                ? 'Configure at least one building with floors and one room type before creating rooms.'
                : floors.length === 0
                  ? 'Add a building and floor in Property Setup before creating rooms.'
                  : 'Add at least one room type in Property Setup before creating rooms.'}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-room-floor">Floor</Label>
              <Select
                value={form.floorId}
                onValueChange={(floorId) => setForm((prev) => ({ ...prev, floorId }))}
                required
              >
                <SelectTrigger id="create-room-floor">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-room-type">Room Type</Label>
              <Select
                value={form.roomTypeId}
                onValueChange={(roomTypeId) => setForm((prev) => ({ ...prev, roomTypeId }))}
                required
              >
                <SelectTrigger id="create-room-type">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>
                      {rt.name} ({rt.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-room-number">Room Number</Label>
              <Input
                id="create-room-number"
                value={form.roomNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="e.g. 101"
                maxLength={20}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-room-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(category) =>
                  setForm((prev) => ({ ...prev, category: category as CreateRoomSchema['category'] }))
                }
              >
                <SelectTrigger id="create-room-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isSmoking}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isSmoking: checked === true }))
                  }
                />
                Smoking allowed
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isAccessible}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isAccessible: checked === true }))
                  }
                />
                Accessible
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-room-notes">Notes (optional)</Label>
              <Textarea
                id="create-room-notes"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Internal notes about this room"
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={submitting}
                disabled={!form.floorId || !form.roomTypeId || !form.roomNumber.trim()}
              >
                Create Room
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
