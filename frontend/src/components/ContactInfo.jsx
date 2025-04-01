import React from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import OpenImageInNewTab from "../lib/OpenImageInNewTab";

const ContactInfo = ({ setOpenContact }) => {
  const { user } = useSelector((store) => store.auth);

  return (
    <Dialog open={true} onOpenChange={setOpenContact}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div>
            <Label className="font-semibold">User Name:</Label>
            <p className="text-gray-600">{user?.username || "N/A"}</p>
          </div>
          <div>
            <Label className="font-semibold">Email:</Label>
            <p className="text-gray-600">{user?.email || "N/A"}</p>
          </div>
          <div>
            <Label className="font-semibold">Phone:</Label>
            <p className="text-gray-600">{user?.phone || "N/A"}</p>
          </div>
          <div>
            <Label className="font-semibold">Bio:</Label>
            <p className="text-gray-600">{user?.bio || "N/A"}</p>
          </div>
          <div>
            <Label className="font-semibold">Role:</Label>
            <p className="text-gray-600">{user?.role || "N/A"}</p>
          </div>
        </div>

        {/* Resume Button */}
        <div className="text-center">
          <OpenImageInNewTab imageUrl={user?.resume}>
            <Button variant="outline">Show Resume</Button>
          </OpenImageInNewTab>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactInfo;
