import React from 'react';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="min-w-[250px] flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
};

export default SearchBar;
