'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { LayoutDashboard, Package, FolderTree, FileText, UserCircle, GitFork, LogOut, Ticket } from 'lucide-react';
import Products from './Products';
import Categories from './Categories';
import Invoices from './Invoices';
import Users from './Users';
import SubCategories from './SubCategories';
import Coupons from './Coupons';
import { useAuthStore } from '@/store/authStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface TabItem {
  name: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

const tabs: TabItem[] = [
  { name: 'Products', icon: Package, component: Products },
  { name: 'Categories', icon: FolderTree, component: Categories },
  { name: 'Subcategories', icon: GitFork, component: SubCategories },
  { name: 'Coupons', icon: Ticket, component: Coupons },
  { name: 'Invoices', icon: FileText, component: Invoices },
  { name: 'Users', icon: UserCircle, component: Users }
];

export default function Dashboard() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="h-8 w-8 text-cyan-600" />
              <div>
                <h1 className="text-xl font-bold text-cyan-900">Aquakart</h1>
                <p className="text-xs text-cyan-600">Business Management Suite</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-white p-1.5 shadow-lg shadow-cyan-100/50">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all duration-200 ease-out',
                    'ring-white/60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                      : 'text-cyan-700 hover:bg-cyan-50 hover:text-cyan-900'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-6 shadow-lg shadow-cyan-100/50',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  'transition-all duration-300 ease-out',
                  'animate-fadeIn'
                )}
              >
                <tab.component />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
}