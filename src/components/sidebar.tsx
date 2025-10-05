import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLoginState } from "@/hooks/use-login-state";
import { useMe } from "@/hooks/use-user";
import {
	LayoutDashboard,
	Users,
	Settings,
	LogOut,
	Menu,
	X,
	User,
	Shield,
	BookOpen,
	List,
	Tag,
} from "lucide-react";

interface SidebarProps {
	isOpen: boolean;
	onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
	const location = useLocation();
	const { logout } = useLoginState();
	const { data: user, isLoading, error } = useMe();

	const navigationItems = [
		{
			name: "Dashboard",
			href: "/",
			icon: LayoutDashboard,
			description: "Ana sayfa",
		},
		{
			name: "Kullanıcı Listesi",
			href: "/users",
			icon: Users,
			description: "Kullanıcı yönetimi",
		},
		{
			name: "Kategori Listesi",
			href: "/categories",
			icon: List,
			description: "Kategori yönetimi",
		},
		{
			name: "Tag Listesi",
			href: "/tags",
			icon: Tag,
			description: "Tag yönetimi",
		},
		{
			name: "Post Listesi",
			href: "/posts",
			icon: BookOpen,
			description: "Post yönetimi",
		},
		{
			name: "Ayarlar",
			href: "/settings",
			icon: Settings,
			description: "Sistem ayarları",
		},
	];

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
					onClick={onToggle}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
        shadow-xl lg:shadow-none
      `}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-24">
						<div className="flex items-center space-x-3 ">
							<div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
								<Shield className="w-5 h-5 text-white" />
							</div>
							<div>
								<span className="text-lg font-semibold text-gray-900 dark:text-white">
									Admin Panel
								</span>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Yönetim Sistemi
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={onToggle}
							className="lg:hidden"
						>
							<X className="w-5 h-5" />
						</Button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 pl-3 pr-0 py-4 space-y-1 overflow-y-auto">
						{navigationItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.href || 
								(item.href !== "/" && location.pathname.startsWith(item.href));

							return (
								<Link
									key={item.name}
									to={item.href}
									className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
											isActive
												? "bg-black/10 dark:bg-blue-900 text-black dark:text-black"
												: "text-gray-700 dark:text-gray-300"
										}
                  `}
									onClick={() => {
										if (window.innerWidth < 1024) {
											onToggle();
										}
									}}
								>
									<Icon className="w-5 h-5" />
									<div>
										<span>{item.name}</span>
										{item.description && (
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{item.description}
											</p>
										)}
									</div>
								</Link>
							);
						})}
					</nav>

					{/* User Info & Footer */}
					<div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
						{/* User Info */}
						{isLoading ? (
							<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
								<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
								<div className="flex-1">
									<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
									<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
								</div>
							</div>
						) : error ? (
							<div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
								<div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
									<User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-orange-800 dark:text-orange-200">
										Bağlantı Hatası
									</p>
									<p className="text-xs text-orange-600 dark:text-orange-400">
										API sunucusu çalışmıyor
									</p>
								</div>
							</div>
						) : user ? (
							<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
								<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
									<User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
										{user.firstName} {user.lastName}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
										{user.email}
									</p>
									<div className="flex items-center space-x-1 mt-1">
										<div
											className={`w-2 h-2 rounded-full ${
												user.isActive ? "bg-green-500" : "bg-red-500"
											}`}
										/>
										<span className="text-xs text-gray-500 dark:text-gray-400">
											{user.isActive ? "Aktif" : "Pasif"}
										</span>
									</div>
								</div>
							</div>
						) : (
							<div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
								<div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
									<User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
										Kullanıcı Verisi Yok
									</p>
									<p className="text-xs text-yellow-600 dark:text-yellow-400">
										Veri yüklenemedi
									</p>
								</div>
							</div>
						)}

						{/* Logout Button */}
						<Button
							variant="default"
							onClick={handleLogout}
							className="w-full justify-start text-white bg-red-600 border-red-600"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Çıkış Yap
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

// Mobile menu button component
export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={onToggle}
			className="lg:hidden fixed top-4 left-4 z-50"
		>
			<Menu className="w-5 h-5" />
		</Button>
	);
}
