"use client";
import {
  AddressBookIcon,
  Analytics,
  BrowserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar";

const routes = [
  {
    name: "websites",
    route: "/websites",
    icon: BrowserIcon,
  },
  {
    name: "analytics",
    route: "/analytics",
    icon: Analytics,
  },
];
const GeneralMenus = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarGroupLabel>General</SidebarGroupLabel>
        <SidebarMenu>
          {routes.map((r) => {
            const isActive = pathname.startsWith(r.route);
            return (
              <React.Fragment key={r.name}>
                <Link href={r.route}>
                  <SidebarMenuButton
                    tooltip={r.name}
                    className={cn(
                      "cursor-pointer",
                      isActive && "bg-sidebar-accent-foreground/10 ",
                    )}
                    style={
                      isActive
                        ? {
                            boxShadow: `
                                0px 1px  2px rgb(22,22,22) 
                                `,
                          }
                        : {}
                    }
                  >
                    <HugeiconsIcon
                      icon={r.icon}
                      size={16}
                      className="opacity-90"
                    />
                    {r.name}
                  </SidebarMenuButton>
                </Link>
              </React.Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default GeneralMenus;
