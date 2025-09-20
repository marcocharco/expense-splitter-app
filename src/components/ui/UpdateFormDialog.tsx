"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UpdateFormDialogProps {
  title: string;
  description: string;
  children: (closeDialog: () => void) => ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateFormDialog = ({
  title,
  description,
  children,
  open,
  onOpenChange,
}: UpdateFormDialogProps) => {
  const closeDialog = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[70vw] !w-[60vw] px-12 py-12 max-h-[80vh] overflow-y-auto min-w-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children(closeDialog)}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFormDialog;
