import { useState } from "react";
import { User, LogOut } from "lucide-react";

interface SettingsProps {
  loggedUser: any;
  setLoggedUser: any;
}

export default function SettingsView({
  loggedUser,
  setLoggedUser
}: SettingsProps)  {

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [profileImage, setProfileImage] = useState("");

  const [name, setName] = useState(loggedUser?.name || "");
  const [email] = useState(loggedUser?.email || "");
  const [role] = useState(loggedUser?.role || "");

  const [address, setAddress] = useState("Anna Nagar");
  const [city, setCity] = useState("Chennai");
  const [stateName, setStateName] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("625020");

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {

      const imageUrl = URL.createObjectURL(file);

      setProfileImage(imageUrl);

    }

  };

  const saveProfile = async () => {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  
    const response = await fetch(
  
      `http://localhost:5000/api/users/${user.id}`,
  
      {
        method: "PUT",
  
        headers: {
          "Content-Type": "application/json"
        },
  
        body: JSON.stringify({

          name,
          email,
          role,
          address,
          city,
          stateName,
          pincode,
          profileImage
        
        })
      }
  
    );
  
    const updatedUser = await response.json();
  
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    window.dispatchEvent(
      new Event("userUpdated")
    );
      
    window.location.reload();
  
  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.reload();

  };

  return (

    <div className="space-y-6">
      {successMessage && (
  <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl border border-green-300">
    {successMessage}
  </div>
)}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            System Settings
          </h1>

          <p className="text-slate-500 mt-1">
            Manage profile information and account settings.
          </p>

        </div>

        <button
         onClick={saveProfile}
          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl shadow transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">

          <div>

            <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Profile Information
            </h2>

            <p className="text-slate-500 mt-1">
              Update your personal information and profile picture
            </p>

          </div>

          {
            !isEditing ? (

              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition"
              >
                Edit Profile
              </button>

            ) : (

              <button
              onClick={async () => {

                await saveProfile();
              
                setIsEditing(false);
              
              }}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
              >
                Save Changes
              </button>

            )
          }

        </div>

        {/* Profile Image */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-10">

          <img
            src={
              profileImage ||
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border shadow"
          />

          <div className="space-y-3">

            <input
              type="file"
              accept="image/*"
              disabled={!isEditing}
              onChange={handleImageUpload}
              className="block text-sm disabled:opacity-50"
            />

            <p className="text-sm text-slate-500">
              Profile image optional
            </p>

          </div>

        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Full Name *
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="w-full border rounded-xl p-3 disabled:bg-slate-100 disabled:text-slate-500"
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              value={email}
              disabled
              className="w-full border rounded-xl p-3 bg-slate-100 text-slate-500"
            />

          </div>

          {/* Address */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Address *
            </label>

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
              className="w-full border rounded-xl p-3 disabled:bg-slate-100 disabled:text-slate-500"
            />

          </div>

          {/* City */}
          <div>

            <label className="block text-sm font-medium mb-2">
              City *
            </label>

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!isEditing}
              className="w-full border rounded-xl p-3 disabled:bg-slate-100 disabled:text-slate-500"
            />

          </div>

          {/* State */}
          <div>

            <label className="block text-sm font-medium mb-2">
              State *
            </label>

            <input
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              disabled={!isEditing}
              className="w-full border rounded-xl p-3 disabled:bg-slate-100 disabled:text-slate-500"
            />

          </div>

          {/* Pincode */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Pincode *
            </label>

            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              disabled={!isEditing}
              className="w-full border rounded-xl p-3 disabled:bg-slate-100 disabled:text-slate-500"
            />

          </div>

          {/* Role */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Role
            </label>

            <input
              value={role}
              disabled
              className="w-full border rounded-xl p-3 bg-slate-100 text-slate-500"
            />

          </div>

        </div>

      </div>

    </div>

  );

}