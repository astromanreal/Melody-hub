'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music2, Moon, Sun, TrendingUp, Settings, Library } from 'lucide-react'; // Added Library icon for Albums
import { useTheme } from 'next-themes'; // Import useTheme hook
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
   // State to manage hydration mismatch for theme icon
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);


  const navItems = [
    { href: '/trending', label: 'Trending', icon: TrendingUp },
    { href: '/artists', label: 'Artists' },
    { href: '/albums', label: 'Albums', icon: Library }, // Added Albums link
    { href: '/songs', label: 'Songs' },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/" // Keep logo linking to home page
            className="flex items-center gap-2 text-xl font-bold text-foreground"
          >
            <Music2 className="h-6 w-6 text-accent" />
            Melody Hub
          </Link>
          <div className="flex items-center space-x-4"> {/* Adjusted spacing for buttons */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent flex items-center gap-1.5', // Added flex and gap
                  pathname === item.href ? 'text-accent' : 'text-foreground/80'
                )}
              >
                 {item.icon && <item.icon className="h-4 w-4" />} {/* Conditionally render icon */}
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle Button */}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        {/* Render icon only after mount to avoid hydration mismatch */}
                        {mounted && theme === 'dark' ? (
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-100" />
                        ) : (
                             <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-100 transition-all dark:rotate-0 dark:scale-100" />
                        )}
                         <span className="sr-only">Toggle theme</span>
                     </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                        Light
                     </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                         Dark
                     </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                         System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

             {/* Settings Button */}
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href="/settings">
                 <Settings className="h-[1.2rem] w-[1.2rem]" />
                 <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
