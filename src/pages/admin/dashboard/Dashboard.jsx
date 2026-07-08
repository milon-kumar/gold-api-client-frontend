import {
    Activity,
    CreditCard,
    DollarSign,
    Download,
    TrendingUp,
    User,
    Users,
    Folder,
    Mail,
    PieChart,
    Target,
    Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ThemeToggle from "@/components/shear/ThemeToggle.jsx";
export default function Dashboard() {

    return (
        <>
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Welcome back, John! Here's what's happening with your business today.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Reports
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        title: "Total Revenue",
                        value: "$45,231.89",
                        change: "+20.1%",
                        icon: DollarSign,
                        trend: "up",
                    },
                    {
                        title: "Subscriptions",
                        value: "+2350",
                        change: "+180.1%",
                        icon: Users,
                        trend: "up",
                    },
                    {
                        title: "Sales",
                        value: "+12,234",
                        change: "+19%",
                        icon: CreditCard,
                        trend: "up",
                    },
                    {
                        title: "Active Now",
                        value: "+573",
                        change: "+201",
                        icon: Activity,
                        trend: "neutral",
                    },
                ].map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Chart Section */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            Your revenue performance over the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px] w-full">
                            {/* Simple bar chart representation */}
                            <div className="flex h-full items-end gap-2">
                                {[65, 45, 70, 55, 80, 90].map((height, i) => (
                                    <div key={i} className="flex-1 space-y-2">
                                        <div
                                            className="bg-primary rounded-md transition-all"
                                            style={{ height: `${height}%` }}
                                        />
                                        <p className="text-center text-xs text-muted-foreground">
                                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Section */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest transactions and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="transactions">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                                <TabsTrigger value="updates">Updates</TabsTrigger>
                            </TabsList>
                            <TabsContent value="transactions" className="space-y-4 mt-4">
                                {[
                                    { name: "Netflix", amount: "$14.99", date: "Today", icon: "N" },
                                    { name: "Spotify", amount: "$9.99", date: "Yesterday", icon: "S" },
                                    { name: "Amazon", amount: "$49.99", date: "Jan 12", icon: "A" },
                                    { name: "Apple", amount: "$4.99", date: "Jan 10", icon: "A" },
                                ].map((tx) => (
                                    <div key={tx.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                <span className="text-xs font-medium">{tx.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{tx.name}</p>
                                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium">{tx.amount}</span>
                                    </div>
                                ))}
                            </TabsContent>
                            <TabsContent value="updates" className="space-y-4 mt-4">
                                {[
                                    { title: "New user signup", time: "2 min ago", icon: User },
                                    { title: "Payment received", time: "1 hour ago", icon: DollarSign },
                                    { title: "Server update", time: "3 hours ago", icon: Activity },
                                ].map((update) => (
                                    <div key={update.title} className="flex items-center gap-3">
                                        <update.icon className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{update.title}</p>
                                            <p className="text-xs text-muted-foreground">{update.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Second Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Progress Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Goals</CardTitle>
                        <CardDescription>Progress towards your targets</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Revenue Target</span>
                                <span className="font-medium">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>User Acquisition</span>
                                <span className="font-medium">45%</span>
                            </div>
                            <Progress value={45} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Product Development</span>
                                <span className="font-medium">92%</span>
                            </div>
                            <Progress value={92} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                            <User className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                        <Button variant="outline" size="sm">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Process Payment
                        </Button>
                        <Button variant="outline" size="sm">
                            <Folder className="mr-2 h-4 w-4" />
                            Create Project
                        </Button>
                        <Button variant="outline" size="sm">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                        </Button>
                    </CardContent>
                </Card>

                {/* Analytics Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                        <CardDescription>Important KPIs at a glance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Conversion Rate</span>
                            </div>
                            <span className="text-sm font-medium">3.24%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <PieChart className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Bounce Rate</span>
                            </div>
                            <span className="text-sm font-medium">24.5%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Avg Session</span>
                            </div>
                            <span className="text-sm font-medium">4m 32s</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest 5 customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { id: "#001", customer: "Alice Johnson", product: "Premium Plan", date: "2024-01-15", status: "Completed", amount: "$299" },
                                { id: "#002", customer: "Bob Smith", product: "Pro Subscription", date: "2024-01-14", status: "Processing", amount: "$199" },
                                { id: "#003", customer: "Carol Davis", product: "Basic Plan", date: "2024-01-13", status: "Shipped", amount: "$99" },
                                { id: "#004", customer: "David Wilson", product: "Enterprise", date: "2024-01-12", status: "Pending", amount: "$599" },
                                { id: "#005", customer: "Emma Brown", product: "Premium Plan", date: "2024-01-11", status: "Completed", amount: "$299" },
                            ].map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.product}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status === "Completed"
                                                    ? "default"
                                                    : order.status === "Processing"
                                                        ? "secondary"
                                                        : order.status === "Shipped"
                                                            ? "outline"
                                                            : "destructive"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{order.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>

    );
}
