"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InstallDialogProps {
  id: string;
}

export function InstallDialog({ id }: InstallDialogProps) {
  const [copied, setCopied] = useState(false);

  const scriptTag = `<script async src="${window.origin}/js/pixel.min.js" data-websiteid="${id}"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          How to Install
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Installation Instructions</DialogTitle>
          <DialogDescription>
            Add this script tag to your website to start tracking analytics
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm font-medium mb-3">
              Add to your website's &lt;head&gt; section:
            </p>
            <div className="relative">
              <code className="block text-xs bg-background p-3 rounded border border-border overflow-x-auto">
                {scriptTag}
              </code>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Steps:</h4>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="font-medium min-w-6">1.</span>
                <span>Copy the script tag above</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium min-w-6">2.</span>
                <span>
                  Paste it in the &lt;head&gt; section of your HTML file
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium min-w-6">3.</span>
                <span>Save and deploy your website</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium min-w-6">4.</span>
                <span>Your analytics data will appear here within minutes</span>
              </li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
