"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/resizable-navbar";
import {
  ChartBar,
  CirclePower,
  DollarSign,
  LogOut,
  MessageCircle,
  Repeat,
  Search,
  Settings2,
  ShoppingCart,
  User2,
  UserRound,
  Store,
  Package,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useAuth, useUser } from "@clerk/nextjs";
import { getConversations } from "../app/data/mock-data";
import { UserRole } from "@/lib/types";

export function NavbarDemo({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mock user role - replace with actual user data from your database
  // TODO: Replace with actual user role from database
  const userRole: UserRole = UserRole.BUYER; // Change to UserRole.SELLER to test seller menu

  const userId = "550e8400-e29b-41d4-a716-446655440000";
  const unreadMessages = getConversations(userId).reduce(
    (count, conv) =>
      count +
      conv.messages.filter((msg) => msg.recipientId === userId && !msg.isRead)
        .length,
    0
  );

  // Ensure theme is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", link: "/home" },
    { name: "Products", link: "/products" },
    { name: "Map", link: "/map" },
  ];

  // Role-based menu items
  const getMenuItems = () => {
    const isSeller = userRole === UserRole.SELLER;

    if (isSeller) {
      return [
        {
          name: "Dashboard",
          link: "/dashboard",
          icon: <ChartBar className="mr-2 h-4 w-4" />,
        },
        {
          name: "My Products",
          link: "/my-products",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          name: "Swap Requests",
          link: "/swap-requests",
          icon: <Repeat className="mr-2 h-4 w-4" />,
        },
        {
          name: "Messages",
          link: "/messages",
          icon: <MessageCircle className="mr-2 h-4 w-4" />,
          badge: unreadMessages > 0 ? unreadMessages : undefined,
        },
        {
          name: "Profile",
          link: "/profile",
          icon: <User2 className="mr-2 h-4 w-4" />,
        },
        {
          name: "Settings",
          link: "/settings",
          icon: <Settings2 className="mr-2 h-4 w-4" />,
        },
      ];
    } else {
      return [
        {
          name: "Profile",
          link: "/profile",
          icon: <User2 className="mr-2 h-4 w-4" />,
        },
        {
          name: "Messages",
          link: "/messages",
          icon: <MessageCircle className="mr-2 h-4 w-4" />,
          badge: unreadMessages > 0 ? unreadMessages : undefined,
        },
        {
          name: "Settings",
          link: "/settings",
          icon: <Settings2 className="mr-2 h-4 w-4" />,
        },
        {
          name: "Become a Seller",
          link: "/become-seller",
          icon: <Store className="mr-2 h-4 w-4" />,
          highlight: true,
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <NavbarButton variant="secondary" href="/search">
              <Search className="h-4 w-4" />
            </NavbarButton>

            {/* Theme Toggle */}
            {mounted && (
              <NavbarButton
                variant="secondary"
                onClick={handleThemeToggle}
                className="relative"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </NavbarButton>
            )}

            {/* Notifications */}
            <NavbarButton variant="secondary" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white flex items-center justify-center text-xs rounded-full">
                2
              </span>
            </NavbarButton>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <NavbarButton variant="secondary">
                  <UserRound className="h-4 w-4" />
                </NavbarButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-border">
                <DropdownMenuLabel>
                  {user?.firstName
                    ? `${user.firstName}'s Account`
                    : "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {menuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    asChild
                    className={
                      item.highlight ? "bg-primary/10 text-primary" : ""
                    }
                  >
                    <a
                      href={item.link}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {item.icon}
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                {isSignedIn ? (
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <a href="/sign-in" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Login
                    </a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* Main Navigation Items */}
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

            {/* Role-based Menu Items */}
            {menuItems.map((item, idx) => (
              <a
                key={`mobile-menu-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors flex items-center justify-between ${
                  item.highlight ? "text-primary font-medium" : ""
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-3">
              {/* Theme Toggle */}
              {mounted && (
                <NavbarButton
                  onClick={() => {
                    handleThemeToggle();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="secondary"
                  className="w-full flex items-center justify-center"
                >
                  {resolvedTheme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </NavbarButton>
              )}

              {/* Logout/Login */}
              {isSignedIn ? (
                <NavbarButton
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="primary"
                  className="w-full flex items-center bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </NavbarButton>
              ) : (
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  href="/sign-in"
                  className="w-full flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Login
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {children}
    </div>
  );
}
