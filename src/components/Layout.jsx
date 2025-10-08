import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Shield, Upload, Download } from 'lucide-react';

function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white shadow-sm border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">Course Monitor</span>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Submit Report
                </Link>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white">
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="py-8">
        {children}
      </main>
      <footer className="bg-neutral-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Course Progress Monitor</h3>
            <p className="text-neutral-300 mb-8">
              Streamline your course progress tracking and assessment management
            </p>
          </div>
        </div>
        <div className="border-t border-neutral-700 py-4">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center text-sm text-neutral-400">
              AI vibe coded development by{' '}
              <a 
                href="https://biela.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Biela.dev
              </a>
              , powered by{' '}
              <a 
                href="https://teachmecode.ae/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                TeachMeCode® Institute
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
