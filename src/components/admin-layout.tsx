import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { SidebarToggle } from "./sidebar";

export default function AdminLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<div className="min-h-screen bg-white flex ">
			<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
			<SidebarToggle onToggle={toggleSidebar} />

			<main className="bg-white pt-0 min-h-screen flex-1">
				<Outlet />
			</main>
		</div>
	);
}
