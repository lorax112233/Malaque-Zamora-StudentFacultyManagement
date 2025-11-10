import React, { useState, useEffect } from "react";
import api from "../axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "", new_password_confirmation: "" });

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/me");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch profile.");
    }
  };

  useEffect(() => {
    fetchProfile(); 
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSaveProfile = async () => {
    try {
      await api.put("/me", {
      name: formData.username,  // because your backend uses "name"
      email: formData.email,
  });
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await api.put("/admin/profile/password", passwordData);
      setShowPasswordModal(false);
      setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
      alert("Password updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update password.");
    }
  };

  if (!profile) return <p className="text-center mt-20 text-[#A7F3D0]">Loading profile...</p>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#A7F3D0] mb-10">My Profile</h1>

        <div className="bg-[#013836]/80 rounded-2xl p-8 shadow-lg border border-[#015E5C]/40">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full bg-[#015E5C]/50 flex items-center justify-center text-3xl font-bold text-white">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold mb-2">{profile.username}</p>
              <p className="text-gray-300 mb-2">Email: {profile.email}</p>
              <div className="flex gap-4 mt-4 flex-wrap">
                <button
                  onClick={() => { setFormData(profile); setShowModal(true); }}
                  className="px-6 py-3 bg-[#00B5AD] rounded-xl text-white font-semibold hover:bg-[#019C95]"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-6 py-3 bg-[#FF9800] rounded-xl text-white font-semibold hover:bg-[#E68900]"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="bg-[#013836] w-full max-w-md p-6 rounded-2xl shadow-xl border border-[#015E5C]/50">
                <h3 className="text-xl font-bold text-[#A7F3D0] mb-4">Edit Profile</h3>
                <input name="username" value={formData.username || ""} onChange={handleChange} placeholder="Username" className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4" />
                <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-500 rounded text-white hover:bg-gray-600">Cancel</button>
                  <button onClick={handleSaveProfile} className="px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700">Save</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Change Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="bg-[#013836] w-full max-w-md p-6 rounded-2xl shadow-xl border border-[#015E5C]/50">
                <h3 className="text-xl font-bold text-[#A7F3D0] mb-4">Change Password</h3>
                <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} placeholder="Current Password" className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4" />
                <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} placeholder="New Password" className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4" />
                <input type="password" name="new_password_confirmation" value={passwordData.new_password_confirmation} onChange={handlePasswordChange} placeholder="Confirm New Password" className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-500 rounded text-white hover:bg-gray-600">Cancel</button>
                  <button onClick={handleSavePassword} className="px-4 py-2 bg-orange-600 rounded text-white hover:bg-orange-700">Save</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
