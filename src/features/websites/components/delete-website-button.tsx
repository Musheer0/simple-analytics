"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import React from "react";
import { DeleteWebsite } from "../actions/mutations";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type pagniatedWebsiteQuery = {
  websites: {
    domain: string;
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    org_id: string;
  }[];
  nextCursor?: number | undefined;
};

type Props = {
  id: string;
};

const DeleteWebsiteButton = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const { orgId } = useAuth();
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: DeleteWebsite,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["website-list", orgId],
      });

      const previousData = queryClient.getQueryData<
        InfiniteData<pagniatedWebsiteQuery>
      >(["website-list", orgId]);

      queryClient.setQueryData<
        InfiniteData<pagniatedWebsiteQuery>
      >(["website-list", orgId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            websites: page.websites.filter(
              (website) => website.id !== id
            ),
          })),
        };
      });

      return { previousData };
    },

    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["website-list", orgId],
          context.previousData
        );
      }

      toast.error("Failed to delete website.");
    },

    onSuccess: () => {
      toast.success("Website deleted successfully.");
    router.push('/websites')
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["website-list", orgId],
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild
      onClick={(e)=>e.stopPropagation()}
      >
        <Button
          size="icon-sm"
          variant="destructive"
          disabled={mutation.isPending}
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this website?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All analytics data
            associated with this website will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel 
          onClick={(e) => {
                e.stopPropagation()
            }}
          disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
                e.stopPropagation()
                mutation.mutate(id)
            }}
            disabled={mutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {mutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Yes, delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWebsiteButton;