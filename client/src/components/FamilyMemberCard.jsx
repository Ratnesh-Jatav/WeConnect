import React from 'react';

const FamilyMemberCard = ({ member, onEdit, onDelete }) => {
  const age = member.dateOfBirth
    ? new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()
    : null;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-52 w-full bg-slate-100">
        {member.profilePhoto ? (
          <img src={member.profilePhoto} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-5xl font-bold text-white">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 p-5">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">{member.name}</h3>
        <p className="mb-2 text-sm font-semibold capitalize text-indigo-500">{member.relation}</p>
        {age && <p className="mb-1 text-[13px] text-slate-500">Age: {age}</p>}
        {member.email && <p className="mb-1 text-[13px] text-slate-500">{member.email}</p>}
        {member.phone && <p className="mb-1 text-[13px] text-slate-500">{member.phone}</p>}
        {member.bio && <p className="mb-1 text-[13px] text-slate-500">{member.bio}</p>}
      </div>

      <div className="mt-auto flex gap-2.5 px-5 pb-5">
        <button
          className="flex-1 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-300"
          onClick={() => onEdit(member)}
        >
          Edit
        </button>
        <button
          className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
          onClick={() => onDelete(member._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FamilyMemberCard;
