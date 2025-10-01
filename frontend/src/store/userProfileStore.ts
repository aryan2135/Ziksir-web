import { create } from "zustand";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface UserProfileStore {
  userData: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
}

const userProfileStore = create<UserProfileStore>((set) => ({
  userData: null,
  setUserProfile: (profile) => set({ userData: profile }),
}));

export default userProfileStore;
