import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import React from "react";
import AddWebsiteDialog from "@/features/websites/components/add-website-dialog";
import Header from "@/features/websites/components/header";
import WebsiteListPaginated from "@/features/websites/components/website-list-paginated";
import { RequireAuth } from "@/lib/requireAuth";

const page = async () => {
  const session = await RequireAuth();
  console.log(session.orgId);
  if (session.orgId)
    return (
      <div className="w-full min-h-screen">
        <Header orgId={session.orgId} />
        <WebsiteListPaginated orgId={session.orgId} />
      </div>
    );

  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center mt-20 p-8">
        <h2 className="text-2xl font-semibold mb-4">
          No Organization Selected
        </h2>
        <p className="text-muted-foreground mb-6">
          Please select or create an organization to view your websites.
        </p>
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
            },
          }}
        />
      </div>
    </div>
  );
};

export default page;
