import React, { useState } from 'react';
import { familyMemberService } from '../services/api';
import toast from 'react-hot-toast';

const relations = ['mother', 'father', 'brother', 'sister', 'spouse', 'child', 'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'other'];

const AddFamilyMemberModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', relation: '', dateOfBirth: '', bio: '', email: '', phone: '', address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await familyMemberService.create(formData);
      toast.success('Family member added!');
      onAdd();
    } catch (error) {
      toast.error('Failed to add family member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-5" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-4 top-3 text-3xl text-slate-500 hover:text-slate-800" onClick={onClose}>×</button>
        <h2 className="mb-5 text-2xl font-semibold text-slate-800">Add Family Member</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-800">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Member's name" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-slate-800">Relation *</label>
              <select name="relation" value={formData.relation} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required>
                <option value="">Select relation</option>
                {relations.map(rel => <option key={rel} value={rel}>{rel.charAt(0).toUpperCase() + rel.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-800">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Additional information" rows="3" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-slate-800">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="mb-2 block font-medium text-slate-800">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button type="button" className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60" disabled={loading}>{loading ? 'Adding...' : 'Add Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;
