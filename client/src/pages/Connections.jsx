import React, { useEffect, useState } from 'react';
import { connectionService } from '../services/api';
import { Link } from 'react-router-dom';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

export default function Connections() {
  const [connections, setConnections] = useState([]);

  const load = async () => {
    try {
      const res = await connectionService.listConnections();
      setConnections(res.data.connections || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold md:text-3xl text-white ">Your Connections</h1>
        <p className="text-sm text-slate-500">Open a connection profile to view shared members, albums, and videos.</p>
      </div>

      <div className="grid gap-3">
        {connections.length === 0 && <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">No connections yet</div>}
        {connections.map((c) => (
          <Link
            key={c._id}
            to={`/users/${c._id}/content`}
            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <img src={c.profilePhoto || DEFAULT_AVATAR} alt="pf" className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
            <div>
              <div className="font-semibold text-slate-800">{c.name}</div>
              <div className="text-sm text-slate-500">{c.email}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
