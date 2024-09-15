import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col">
      <main className="flex grow flex-col overflow-hidden">{children}</main>
    </div>
  );
}
