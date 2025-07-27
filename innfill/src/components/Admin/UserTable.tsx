// src/components/Admin/UserTable.tsx
'use client';

import React from 'react';
import Link from 'next/link';

// Define a more specific type for the user data we'll display in the table
export type UserForTable = {
  id: string;
  full_name: string | null;
  email: string | undefined; // Email comes from the joined auth.users table
  user_type: 'client' | 'freelancer' | 'individual' | 'admin';
  created_at: string;
};

type UserTableProps = {
  users: UserForTable[];
};

const UserTable = ({ users }: UserTableProps) => {
  if (!users || users.length === 0) {
    return <p className="text-gray-400">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 rounded-tl-lg">Name</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Email</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Role</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Joined On</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-700/50 transition-colors duration-200">
              <td className="py-3 px-4 whitespace-nowrap">{user.full_name || 'N/A'}</td>
              <td className="py-3 px-4 whitespace-nowrap">{user.email || 'N/A'}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${user.user_type === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                  {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <Link href={`/admin/users/${user.id}`} className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
