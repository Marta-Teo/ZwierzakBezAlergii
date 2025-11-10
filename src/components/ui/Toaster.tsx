import { Toaster as SonnerToaster } from 'sonner';

/**
 * Komponent Toaster dla toast notifications
 * Używa biblioteki sonner
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
      }}
    />
  );
}

