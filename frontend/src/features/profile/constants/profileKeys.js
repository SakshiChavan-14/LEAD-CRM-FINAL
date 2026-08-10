export const PROFILE_KEYS = {
  all: ["telecaller-profile"],
  me: () => [...PROFILE_KEYS.all, "me"],
  avatar: () => [...PROFILE_KEYS.all, "avatar"],
  settings: () => [...PROFILE_KEYS.all, "settings"],
};
