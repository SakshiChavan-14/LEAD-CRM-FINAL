export const mapProfile = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id || "",
    empId: raw.empId || raw.employeeId || "N/A",
    name: raw.name || raw.fullName || "Unknown User",
    username: raw.username || "N/A",
    email: raw.email || "N/A",
    mobile: raw.mobile || raw.phone || "N/A",
    role: raw.userGroup || raw.role || "Telecaller",
    department: raw.department || "Sales",
    status: raw.status || "ACTIVE",
    avatarUrl: raw.avatar || raw.profilePicture || null,
  };
};

export const mapProfileUpdate = (formData) => {
  return {
    name: formData.name,
    mobile: formData.mobile,
    email: formData.email,
  };
};

export const mapPasswordRequest = (formData) => {
  return {
    currentPassword: formData.currentPassword,
    newPassword: formData.newPassword,
  };
};

export const mapAvatarUpload = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
};
