"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FormDialogProps {
  triggerText: string;
  title: string;
  description: string;
  fullHeight?: boolean;
  children: (closeDialog: () => void) => ReactNode;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  triggerClassName?: string;
}

export const FormDialog = ({
  triggerText,
  title,
  description,
  fullHeight,
  children,
  triggerVariant = "outline",
  triggerClassName,
}: FormDialogProps) => {
  const [open, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClassName}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "!max-w-[70vw] !w-[60vw] px-12 py-12 max-h-[80vh] min-w-auto flex flex-col",
          fullHeight && "min-h-[80vh]"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children(closeDialog)}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
