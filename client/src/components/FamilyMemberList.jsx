import React, { useState } from 'react';
import { familyMemberService } from '../services/api';
import toast from 'react-hot-toast';
import FamilyMemberCard from './FamilyMemberCard';
import EditFamilyMemberModal from './EditFamilyMemberModal';

const FamilyMemberList = ({ members, onUpdate }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await familyMemberService.delete(id);
        toast.success('Member deleted');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete member');
      }
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  return (
    <>
      {members.length === 0 ? (
        <div className="px-5 py-16 text-center text-slate-500">
          <p>No family members found. Add your first family member to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {members.map(member => (
            <FamilyMemberCard
              key={member._id}
              member={member}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showEditModal && selectedMember && (
        <EditFamilyMemberModal
          member={selectedMember}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
};

export default FamilyMemberList;
