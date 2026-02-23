"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddWebsite } from "../actions/mutations";
import type { pagniatedWebsiteQuery } from "../lib/type";

const AddWebsiteDialog = ({
  children,
  orgId,
}: {
  children: React.ReactNode;
  orgId: string;
}) => {
  const [domain, setDomain] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-website"],
    mutationFn: AddWebsite,
    onError: (e) => {
      toast.error(e.message);
    },
    onSuccess: (newWebsite) => {
      toast.success("added website");
      queryClient.setQueryData<{ pages: pagniatedWebsiteQuery[] }>(
        ["website-list", orgId],
        (old) => {
          if (!old) return old;
          const firstPage = old.pages[0];
          if (!firstPage) return old;
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                websites: [newWebsite, ...firstPage.websites],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );
      setOpen(false);
    },
  });
  const handleClick = () => {
    mutate({ domain });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Website</DialogTitle>
          <DialogDescription>
            Enter the website domain you want to add
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Domain</Label>
          <Input
            placeholder="domain"
            alt="domain"
            name="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild disabled={isPending}>
            <Button variant={"destructive"}> Cancel </Button>
          </DialogClose>
          <Button onClick={handleClick} disabled={isPending}>
            {isPending ? "Adding" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWebsiteDialog;
