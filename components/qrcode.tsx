import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

export function QRCodeDialog() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xs rounded-lg">
        <DialogHeader>
          <DialogTitle className="mx-auto text-sm">
            扫描下方二维码，添加客服微信，
            <br />
            领取内测资格
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <Image src="/qrcode.png" alt="二维码" width={250} height={250} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
