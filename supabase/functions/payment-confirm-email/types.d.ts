declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export function serve(
    handler: (req: Request) => Response | Promise<Response>,
    opts?: unknown
  ): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  // Minimal surface sufficient for this function
  export function createClient(url: string, key: string): {
    auth: {
      signInWithOtp(args: {
        email: string;
        options?: {
          emailRedirectTo?: string;
          data?: Record<string, string>;
        };
      }): Promise<{ error: { message: string } | null }>;
    };
  };
}

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}
