"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToogle";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { clearUser } from "../../store/userSlice";
import { useRouter } from "next/navigation";
import Button from "./Button";
import * as Tooltip from "@radix-ui/react-tooltip";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const { name, email, isLoggedIn } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
      <header className="flex justify-between items-center py-2 px-8 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A1B24] transition-colors duration-300">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/cbrexlogo12.png"
              alt="CBREX Logo"
              width={120}
              height={60}
            />
          </Link>
        </div>

        <div className="flex items-center gap-7">
          {isLoggedIn && name && email && (
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className="text-sm text-gray-800 dark:text-gray-200 cursor-default  font-medium">
                    Welcome {name}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="px-3 py-1 rounded text-xs bg-gray-800 text-white dark:bg-white dark:text-black shadow z-50"
                    side="top"
                    sideOffset={6}
                  >
                    {email}
                    <Tooltip.Arrow className="fill-gray-800 dark:fill-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
          <ThemeToggle />
          {isLoggedIn && (
            <Button
              onClick={() => setIsLogoutModalOpen(true)}
              variant="danger"
              size="sm"
            >
              Logout
            </Button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
