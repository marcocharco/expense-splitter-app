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
  title: string;
  description: string;
  children: (closeDialog: () => void) => ReactNode;
  fullHeight?: boolean;

  // For controlled usage (externally managed state)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // For uncontrolled usage with trigger button
  triggerText?: string;
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
  title,
  description,
  children,
  fullHeight,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  triggerText,
  triggerVariant = "outline",
  triggerClassName,
}: FormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerText && (
        <DialogTrigger asChild>
          <Button variant={triggerVariant} className={triggerClassName}>
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className={cn(
          "!max-w-[70vw] !w-[60vw] px-12 py-12 max-h-[80vh] overflow-y-auto min-w-auto flex flex-col",
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
