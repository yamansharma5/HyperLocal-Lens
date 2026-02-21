// LogoutButton is now integrated into Navbar
// This file is kept for backward compatibility
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="btn-danger flex items-center gap-2 text-sm"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}

export default LogoutButton;
