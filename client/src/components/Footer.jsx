import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50 py-6 text-slate-700" role="contentinfo">
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1 text-center md:text-left">
            <strong className="block text-slate-900">Family Memory</strong>
            <span className="text-xs text-slate-600">Preserve and share your family memories securely.</span>
          </div>

          <nav className="flex-1">
            <ul className="flex items-center justify-center gap-6 text-xs">
              <li><a href="#" className="text-slate-600 hover:text-slate-900">Privacy</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">Terms</a></li>
              <li><a href="#" className="text-slate-600 hover:text-slate-900">Contact</a></li>
            </ul>
          </nav>

          <div className="flex-1 text-center md:text-right text-xs text-slate-500">
            © {new Date().getFullYear()} Family Memory. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
