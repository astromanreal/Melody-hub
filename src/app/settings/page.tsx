import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button
import Link from "next/link"; // Import Link
import { SettingsIcon, Github, Twitter, Instagram, Phone } from "lucide-react"; // Added Phone icon


export default function SettingsPage() {
  return (
    <div className="space-y-8">
        <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>

        {/* Add more setting categories (e.g., Account, Storage) as needed */}
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Account</CardTitle>
                 <CardDescription>Manage your account details (placeholder).</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Account settings will be available here.</p>
             </CardContent>
        </Card>

        {/* Social Links Section */}
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Connect with Us</CardTitle>
                <CardDescription>Follow us on social media or contact us.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                {/* Replace '#' with actual social media profile URLs */}
                <Button variant="outline" size="icon" asChild>
                    <Link href="https://github.com/astromanreal" target="_blank" aria-label="GitHub">
                        <Github className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                     <Link href="https://x.com/Sathyamsarthak" target="_blank" aria-label="Twitter">
                        <Twitter className="h-5 w-5" />
                     </Link>
                </Button>

                <Button variant="outline" size="icon" asChild>
                    <Link href="https://www.instagram.com/srishikharji/" target="_blank" aria-label="Instagram">
                        <Instagram className="h-5 w-5" />
                     </Link>
                </Button>

                {/* Phone Number Button */}
                <Button variant="outline" size="icon" asChild>
                    {/* Use tel: URI scheme */}
                    <a href="tel:+918102116569" aria-label="Call us">
                        <Phone className="h-5 w-5" />
                    </a>
                </Button>

                {/* Add more social links as needed */}
            </CardContent>
        </Card>
    </div>
  );
}
