export const mapProfile = (raw) => {
  if (!raw) return null;
  const phoneVal = raw.phoneNo || raw.phone || raw.mobile || raw.mobileNo || "";
  return {
    id: raw.id || raw.slNo || "",
    empId: raw.empId || raw.employeeId || "N/A",
    name: raw.name || raw.fullName || "Unknown User",
    username: raw.username || "N/A",
    email: raw.email || "N/A",
    mobile: phoneVal || "N/A",
    phone: phoneVal || "N/A",
    phoneNo: phoneVal || "N/A",
    role: raw.userGroup || raw.role || "Telecaller",
    department: raw.department || "Sales",
    status: raw.status || "ACTIVE",
    avatarUrl: raw.avatar || raw.profilePicture || raw.photo || null,
  };
};

export const mapProfileUpdate = (formData) => {
  const phoneVal = (formData.mobile || formData.phone || formData.phoneNo || "").trim();
  const nameVal = (formData.name || formData.fullName || "").trim();
  const emailVal = (formData.email || "").trim();

  return {
    name: nameVal,
    fullName: nameVal,
    phone: phoneVal,
    phoneNo: phoneVal,
    phoneNumber: phoneVal,
    mobile: phoneVal,
    mobileNo: phoneVal,
    email: emailVal || null,
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
