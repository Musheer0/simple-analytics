import { PlusIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import AddWebsiteDialog from "./add-website-dialog";

const Header = ({ orgId }: { orgId?: string }) => {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3">
      <p className="font-semibold text-lg">Your Websites</p>

      {orgId && (
        <AddWebsiteDialog orgId={orgId}>
          <Button>
            <PlusIcon />
            Create Website
          </Button>
        </AddWebsiteDialog>
      )}
    </div>
  );
};

export default Header;
