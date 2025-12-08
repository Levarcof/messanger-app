import { create } from "zustand";

interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
};

const useActiveList = create<ActiveListStore>((set) => ({
  members: [],
  add: (id) => set((state) => {
    if (!id || state.members.includes(id)) return state;
    return { members: [...state.members, id] };
  }),
  remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),
  set: (ids) => set({ members: Array.isArray(ids) ? Array.from(new Set(ids)) : [] })
}));

export default useActiveList;