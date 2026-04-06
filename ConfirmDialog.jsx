import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0A1612] border-[#E0A995]/20 text-[#EBE8E3]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-[#E0A995]">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-[#A8B3AF]">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="border-[#E0A995]/20 text-[#A8B3AF] hover:bg-[#E0A995]/10">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            variant="destructive"
            className="bg-red-900/50 hover:bg-red-900/70 text-red-100 border border-red-800"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;