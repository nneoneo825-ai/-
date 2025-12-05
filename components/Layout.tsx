import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  School, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck, 
  Settings, 
  Menu, 
  X,
  Bell,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { MenuLink, User, Role } from '../types';

const MENU_ITEMS: MenuLink[] = [
  { label: '首页概览', path: '/', icon: LayoutDashboard },
  { label: '学校管理', path: '/school', icon: School },
  { label: '德育管理', path: '/moral', icon: GraduationCap },
  { label: '教学管理', path: '/teaching', icon: BookOpen },
  { label: '数据采集', path: '/collection', icon: ClipboardCheck },
  { label: '系统管理', path: '/system', icon: Settings },
];

const MOCK_USER: User = {
  id: '1',
  name: '张主任',
  role: Role.ADMIN,
  avatar: 'https://picsum.photos/200'
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-slate-700 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-xl tracking-wide">
            <span className="text-blue-400">⚓</span>
            <span>水手校园管理</span>
          </div>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
           <div className="flex items-center space-x-3">
              <img src={MOCK_USER.avatar} alt="User" className="h-8 w-8 rounded-full border border-slate-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{MOCK_USER.name}</p>
                <p className="text-xs text-slate-400">{MOCK_USER.role}</p>
              </div>
              <button className="text-slate-400 hover:text-white">
                <LogOut className="h-5 w-5" />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm border-b border-slate-200">
          <button 
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex items-center space-x-4 ml-auto">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                   <UserIcon size={18} />
                </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;