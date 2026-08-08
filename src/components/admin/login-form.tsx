"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Client Component split out of `admin/login/page.tsx` (`useActionState`
 * needs a client boundary) so that page can stay a Server Component and
 * export `metadata` — same pattern as `cart-view.tsx`/`carrito/page.tsx`.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null
  );

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center p-4"
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Gambeta</CardTitle>
          <CardDescription>Panel de administración</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
