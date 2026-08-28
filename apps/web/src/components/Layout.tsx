import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, Activity, ShieldAlert, PackageSearch, KeyRound, Box, FileCode2, TestTube2, FileText, Settings } from 'lucide-react';

export function Layout() {
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Repositories', path: '/dashboard/repositories', icon: FolderGit2 },
    { name: 'Scans', path: '/dashboard/scans', icon: Activity },
    { name: 'Findings', path: '/dashboard/findings', icon: ShieldAlert },
    { name: 'Dependencies', path: '/dashboard/dependencies', icon: PackageSearch },
    { name: 'Secrets', path: '/dashboard/secrets', icon: KeyRound },
    { name: 'Containers', path: '/dashboard/containers', icon: Box },
    { name: 'IaC', path: '/dashboard/iac', icon: FileCode2 },
    { name: 'Experiments', path: '/dashboard/experiments', icon: TestTube2 },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 font-bold text-xl tracking-wider border-b border-slate-800">
          VIBE<span className="text-blue-500">GUARD</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              VG
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
