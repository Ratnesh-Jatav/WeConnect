import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/api';
import { toast } from 'react-hot-toast';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

export default function UserContent() {
  const { userId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userService.getUserContent(userId);
        setData(res.data);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to fetch content');
      }
    };

    load();
  }, [userId]);

  if (!data) return <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-slate-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex items-center gap-4 rounded-xl bg-white p-5 shadow-md">
        <img src={data.owner.profilePhoto || DEFAULT_AVATAR} alt="pf" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
        <div>
          <div className="text-xl font-bold text-slate-800">{data.owner.name}</div>
          <div className="text-sm text-slate-500">Shared family content</div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Family Members</h2>
        {data.members.length === 0 && <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">No family members</div>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.members.map((m) => (
            <div key={m._id} className="rounded-xl bg-white p-4 shadow-md">
              <div className="font-semibold text-slate-800">{m.name}</div>
              <div className="text-sm capitalize text-indigo-500">{m.relation}</div>
              {m.profilePhoto && <img src={m.profilePhoto} alt="pf" className="mt-3 h-44 w-full rounded-lg object-cover" />}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Albums</h2>
        {data.albums.length === 0 && <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">No albums</div>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.albums.map((a) => (
            <div key={a._id} className="rounded-xl bg-white p-4 shadow-md">
              <div className="font-semibold text-slate-800">{a.title}</div>
              <div className="text-sm text-slate-500">{new Date(a.eventDate).toLocaleDateString()}</div>
              {a.coverImage && <img src={a.coverImage} alt="cov" className="mt-3 h-44 w-full rounded-lg object-cover" />}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Videos</h2>
        {data.videos.length === 0 && <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">No videos</div>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.videos.map((v) => (
            <div key={v._id} className="rounded-xl bg-white p-4 shadow-md">
              <div className="font-semibold text-slate-800">{v.title}</div>
              <video src={v.videoUrl} controls className="mt-3 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
