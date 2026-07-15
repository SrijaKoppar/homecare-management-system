import { toast } from '@/hooks/use-toast';

/**
 * Replaces browser alert() calls with the app's toast notifications.
 * `toast()` from hooks/use-toast is a plain function (not a hook), so it
 * can be called from anywhere - event handlers, catch blocks, etc.
 */
export function notifySuccess(description: string, title = 'Success') {
  toast({ title, description });
}

export function notifyError(description: string, title = 'Something went wrong') {
  toast({ title, description, variant: 'destructive' });
}
