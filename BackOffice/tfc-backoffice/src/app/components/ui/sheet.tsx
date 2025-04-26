"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // Confirma que este caminho está correto!

export function Sheet({ children }: { children: React.ReactNode }) {
  return <Dialog.Root>{children}</Dialog.Root>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <Dialog.Title className="sr-only">{children}</Dialog.Title>;
}


export function SheetTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Trigger asChild>
      <button className={cn(className)}>{children}</button>
    </Dialog.Trigger>
  );
}

export function SheetContent({
  children,
  className,
  side = "left",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content
        className={cn(
          "fixed top-0 h-full bg-white p-6 shadow-md transition-transform",
          side === "left" ? "left-0 w-64" : "",
          side === "right" ? "right-0 w-64" : "",
          className
        )}
      >
        <Dialog.Close className="absolute top-4 right-4">
          <X size={20} />
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
