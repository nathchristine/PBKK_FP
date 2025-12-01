"use client";

import { useRouter } from 'next/navigation';
import { 
  Book as BookIcon, 
  ClipboardList, 
  User, 
  PlusSquare, 
  Users, 
  LucideIcon 
} from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, isActive, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-3 mb-2 transition-all duration-300 rounded-r-full group ${
      isActive
        ? 'bg-[#f3f4f6] shadow-sm translate-x-2'
        : 'hover:bg-[#f3f4f6]/30 hover:translate-x-1'
    }`}
  >
    <Icon 
      size={20} 
      className={isActive ? 'text-[#262626]' : 'text-[#6d6e6f] group-hover:text-[#262626]'} 
    />
    <span 
      className={`font-medium ${
        isActive ? 'text-[#262626]' : 'text-[#6d6e6f] group-hover:text-[#262626]'
      }`}
    >
      {label}
    </span>
  </button>
);

interface SidebarProps {
  role: string;
  activePage: 'books' | 'transactions' | 'members' | 'add_book' | 'profile';
}

const Sidebar = ({ role, activePage }: SidebarProps) => {
  const router = useRouter();

  return (
    <div className="w-64 h-screen flex flex-col py-8 fixed left-0 top-0 z-20">
      <div className="px-8 mb-12">
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md flex items-center gap-2">
          BookNest
        </h1>
      </div>

      <nav className="flex-1 pr-4">
        <SidebarItem 
            icon={BookIcon} 
            label="Books" 
            isActive={activePage === 'books'} 
            onClick={() => router.push('/books')} 
        />
        <SidebarItem 
            icon={ClipboardList} 
            label="Transactions" 
            isActive={activePage === 'transactions'} 
            onClick={() => router.push('/transactions')} 
        />
        
        {/* admin only pages */}
        {role === 'admin' && (
          <>
            <SidebarItem 
                icon={Users} 
                label="Members" 
                isActive={activePage === 'members'} 
                onClick={() => router.push('/members')} 
            />
            <SidebarItem 
                icon={PlusSquare} 
                label="Add Book" 
                isActive={activePage === 'add_book'} 
                onClick={() => router.push('/books/create')} 
            />
          </>
        )}
        
        <SidebarItem 
            icon={User} 
            label="Profile" 
            isActive={activePage === 'profile'} 
            onClick={() => router.push('/profile')} 
        />
      </nav>
    </div>
  );
};

export default Sidebar;