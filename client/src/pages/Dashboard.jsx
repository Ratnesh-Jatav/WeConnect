import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { familyMemberService } from '../services/api';
import FamilyMemberList from '../components/FamilyMemberList';
import AddFamilyMemberModal from '../components/AddFamilyMemberModal';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [relationFilter, setRelationFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await familyMemberService.getAll({ search, relation: relationFilter });
      setMembers(response.data.members);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  }, [search, relationFilter]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleAddMember = () => {
    loadMembers();
    setShowModal(false);
  };

  const relations = ['mother', 'father', 'brother', 'sister', 'spouse', 'child', 'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'other'];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-1 text-2xl text-white font-bold md:text-3xl">Family Dashboard</h1>
          <p className="text-slate-500">Welcome, {user?.name}</p>
        </div>
        <button
          className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          onClick={() => setShowModal(true)}
        >
          + Add Family Member
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search family members..." />
        <select
          value={relationFilter}
          onChange={(e) => setRelationFilter(e.target.value)}
          className="min-w-[150px] rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">All Relations</option>
          {relations.map(rel => (
            <option key={rel} value={rel}>{rel.charAt(0).toUpperCase() + rel.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="px-5 py-10 text-center text-base text-slate-500">Loading family members...</div>
      ) : (
        <FamilyMemberList members={members} onUpdate={loadMembers} />
      )}

      {showModal && <AddFamilyMemberModal onClose={() => setShowModal(false)} onAdd={handleAddMember} />}
    </div>
  );
};

export default Dashboard;
