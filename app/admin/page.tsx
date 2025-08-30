import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "@/components/admin/dashboard-overview";
import DonationManagement from "@/components/admin/donation-management";
import CampaignSettings from "@/components/admin/campaign-settings";
import UserManagement from "@/components/admin/user-management";
import { Shield, BarChart3, Users, Settings } from "lucide-react";

export default function AdminDashboard() {
	return (
		<div className="min-h-screen bg-background">
			{/* Admin Header */}
			<header className="border-b border-border bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Shield className="h-8 w-8 text-primary" />
							<div>
								<h1 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h1>
								<p className="text-sm text-muted-foreground">TechForGood Campaign Management</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-right">
								<p className="text-sm font-semibold text-foreground">Admin User</p>
								<p className="text-xs text-muted-foreground">Last login: 2 hours ago</p>
							</div>
							<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
								<Shield className="h-5 w-5 text-primary" />
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
						<TabsTrigger value="overview" className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4" />
							Overview
						</TabsTrigger>
						<TabsTrigger value="donations" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							Donations
						</TabsTrigger>
						<TabsTrigger value="users" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							Users
						</TabsTrigger>
						<TabsTrigger value="settings" className="flex items-center gap-2">
							<Settings className="h-4 w-4" />
							Settings
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview">
						<DashboardOverview />
					</TabsContent>

					<TabsContent value="donations">
						<DonationManagement />
					</TabsContent>

					<TabsContent value="users">
						<UserManagement />
					</TabsContent>

					<TabsContent value="settings">
						<CampaignSettings />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
