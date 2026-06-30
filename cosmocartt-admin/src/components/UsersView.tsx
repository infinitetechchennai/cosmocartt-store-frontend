import { API_URL, apiPath } from "../config/api";
import { readCachedApiData } from "../utils/cacheRead";
import { useState, useEffect, FormEvent } from "react";
import { User } from "../types";
import {
  Plus,
  Search,
  Trash2,
  Pencil
} from "lucide-react";

interface UsersViewProps {
  users: User[];
  setUsers: (users: User[]) => void;
  loggedUser: any;
}

export default function UsersView({
  users,
  setUsers,
  loggedUser
}: UsersViewProps) {

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [newPassword, setNewPassword] = useState("");

  const [permissions, setPermissions] = useState<string[]>([]);

  const [editingUser, setEditingUser] = useState<any>(null);

  const [userTypeFilter, setUserTypeFilter] =
    useState("all");
  const [customers, setCustomers] = useState<any[]>(() =>
    readCachedApiData(apiPath("/api/customers"), [])
  );

  const [editName, setEditName] = useState("");

  const [editEmail, setEditEmail] = useState("");

  const [editRole, setEditRole] = useState("staff");

  const [editPermissions, setEditPermissions] =
    useState<string[]>([]);

  const [selectedCustomers,
    setSelectedCustomers] =
    useState<string[]>([]);

  // FETCH USERS FROM BACKEND
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const usersRes = await fetch(
          apiPath("/api/users")
        );

        const usersData = await usersRes.json();

        setUsers(usersData);

        const customersRes = await fetch(
          apiPath("/api/customers")
        );

        const customersData = await customersRes.json();

        setCustomers(customersData);

      } catch (err) {


      }

    };

    fetchUsers();

    window.addEventListener(
      "userUpdated",
      fetchUsers
    );

    return () => {

      window.removeEventListener(
        "userUpdated",
        fetchUsers
      );

    };

  }, []);

  // SEARCH FILTER
  const combinedUsers = [

    ...users,

    ...customers.map((customer: any) => ({

      ...customer,

      role: customer.customerType,

      permissions: [],

      activityLogs: []

    }))

  ];

  const filteredUsers = combinedUsers.filter((u: any) => {

    const matchesSearch =

      u.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

      ||

      u.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =

      userTypeFilter === "all"

        ? true

        : u.role === userTypeFilter;

    return matchesSearch && matchesType;

  });


  const updateVerification = async (
    id: string,
    status: string
  ) => {

    try {

      const res = await fetch(
        `${API_URL}/api/customers/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            verificationStatus:
              status
          })
        }
      );

      if (!res.ok) {

        alert(
          "Failed to update"
        );

        return;

      }

      setCustomers(

        customers.map((c: any) =>

          c._id === id

            ? {
              ...c,
              verificationStatus: status
            }

            : c

        )

      );

    } catch (error) {


    }

  };


  const bulkApprove = async () => {

    try {

      await Promise.all(

        selectedCustomers.map(

          (id) =>

            fetch(

              `${API_URL}/api/customers/${id}`,

              {

                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                  verificationStatus:
                    "Verified"

                })

              }

            )

        )

      );

      setCustomers(

        customers.map((c: any) =>

          selectedCustomers.includes(
            c._id
          )

            ? {
              ...c,
              verificationStatus:
                "Verified"
            }

            : c

        )

      );

      setSelectedCustomers([]);

    } catch (error) {


    }

  };


  const toggleStatus = async (user: any) => {

    try {

      const isCustomer =
        user.role === "b2b" ||
        user.role === "b2c";

      const newStatus =
        user.status === "Active"
          ? "Inactive"
          : "Active";

      const res = await fetch(

        isCustomer
          ? `${API_URL}/api/customers/${user._id}`
          : `${API_URL}/api/users/${user._id}`,

        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: newStatus
          })

        }

      );

      const updatedUser = await res.json();

      if (isCustomer) {

        setCustomers(

          customers.map((c: any) =>

            c._id === updatedUser._id

              ? updatedUser

              : c

          )

        );

      } else {

        setUsers(

          users.map((u: any) =>

            u._id === updatedUser._id

              ? updatedUser

              : u

          )

        );

      }

    } catch (error) {


    }

  };

  const openEditUser = (user: any) => {

    if (loggedUser?.role !== "admin") {
      return;
    }

    setEditingUser(user);

    setEditName(user.name);

    setEditEmail(user.email);

    setEditRole(user.role);

    setEditPermissions(
      user.permissions || []
    );
  };

  const saveEditedUser = async () => {

    const isCustomer =
      editingUser.role === "b2b" ||
      editingUser.role === "b2c";

    if (loggedUser?.role !== "admin") {
      return;
    }

    try {

      const res = await fetch(

        isCustomer
          ? `${API_URL}/api/customers/${editingUser._id}`
          : `${API_URL}/api/users/${editingUser._id}`,

        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name: editName,

            email: editEmail,

            role: editRole,

            permissions:
              editRole === "admin"
                ? permissionList
                : editPermissions

          })

        }

      );

      const updatedUser =
        await res.json();

      setUsers(

        users.map((u: any) =>

          u._id === updatedUser._id
            ? updatedUser
            : u

        )

      );

      setEditingUser(null);

      window.location.reload();

    } catch (error) {


    }

  };

  // DELETE USER
  const deleteUser = async (id: string) => {

    const targetUser =
      users.find((u: any) => u._id === id)
      ||
      customers.find((u: any) => u._id === id);

    const isCustomer =
      targetUser?.customerType === "b2b" ||
      targetUser?.customerType === "b2c";

    if (loggedUser?.role !== "admin") {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(

        isCustomer
          ? `${API_URL}/api/customers/${id}`
          : `${API_URL}/api/users/${id}`,

        {
          method: "DELETE"
        }

      );

      if (!res.ok) {

        alert("Failed to delete user");

        return;

      }

      window.location.reload();

    } catch (error) {


    }

  };

  // CREATE USER
  const handleCreate = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    try {

      const res = await fetch(
        apiPath("/api/users"),
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            name: newName,

            email: newEmail,

            password: newPassword,

            role: newRole,

            permissions:
              newRole === "admin"
                ? permissionList
                : permissions

          })

        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(data.message);

        return;

      }

      setUsers([
        data,
        ...users
      ]);

      setNewName("");

      setNewEmail("");

      setNewPassword("");

      setNewRole("staff");

      setPermissions([]);

      setShowAddForm(false);

    } catch (error) {


    }

  };

  const permissionList = [

    "dashboard",

    "users",

    "b2b",

    "orders",

    "payments",

    "reports",

    "delivery",

    "local-delivery",

    "refunds",

    "exchanges",

    "products",

    "campaigns",

    "cms",

    "settings"

  ];

  return (

    <div className="space-y-6 text-left">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-zinc-950">
            User Management
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Manage admin and staff users.
</p>

        </div>

        {
          userTypeFilter === "b2b" && (

            <button
              onClick={bulkApprove}

              disabled={
                selectedCustomers.length === 0
              }

              className={`
      px-4 py-2 rounded-xl
      text-white font-medium

      ${selectedCustomers.length === 0

                  ? "bg-zinc-300 cursor-not-allowed"

                  : "bg-green-600 hover:bg-green-700"
                }
      `}
            >

              Approve Selected

              {
                selectedCustomers.length > 0 &&
                ` (${selectedCustomers.length})`
              }

            </button>

          )
        }


        {loggedUser?.role === "admin" && (

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-black hover:bg-zinc-900 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
  Add User
          </button>

        )}

      </div>

      {/* ADD FORM */}
      {showAddForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between p-6 border-b">

              <h2 className="text-2xl font-bold">
                Create New User
      </h2>

              <button
                onClick={() => setShowAddForm(false)}
                className="text-2xl text-zinc-400 hover:text-zinc-700"
              >
                ×
      </button>

            </div>

            <form
              onSubmit={handleCreate}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >

              <div>

                <label className="text-sm font-medium">
                  Full Name
        </label>

                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) =>
                    setNewName(e.target.value)
                  }
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                />

              </div>

              <div>

                <label className="text-sm font-medium">
                  Email Address
        </label>

                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) =>
                    setNewEmail(e.target.value)
                  }
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                />

              </div>

              <div>

                <label className="text-sm font-medium">
                  Password
        </label>

                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                />

              </div>

              <div>

                <label className="text-sm font-medium">
                  Role
        </label>

                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value)
                  }
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                >
                  <option value="admin">
                    Admin
</option>

                  <option value="staff">
                    Staff
</option>



                </select>

              </div>

              {newRole === "staff" && (

                <div className="border rounded-2xl p-4">

                  <h4 className="font-semibold mb-4">
                    Staff Permissions
          </h4>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                    {permissionList.map((permission) => (

                      <label
                        key={permission}
                        className="flex items-center gap-2 text-sm"
                      >

                        <input
                          type="checkbox"
                          checked={permissions.includes(permission)}
                          onChange={() => {

                            if (
                              permissions.includes(permission)
                            ) {

                              setPermissions(

                                permissions.filter(
                                  p => p !== permission
                                )

                              );

                            } else {

                              setPermissions([
                                ...permissions,
                                permission
                              ]);

                            }

                          }}
                        />

                        {permission}

                      </label>

                    ))}

                  </div>

                </div>

              )}

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold"
              >
                Create User
      </button>

            </form>

          </div>

        </div>

      )}

      {/* USERS TABLE */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">

        {/* SEARCH */}
        <div className="p-4 border-b flex items-center gap-2">

          <Search className="w-4 h-4 text-zinc-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-sm"
          />

        </div>

        <div className="flex gap-6 border-b px-4">

          {[
            "all",
            "admin",
            "staff",
            "b2b",
            "b2c"
          ].map((type) => (

            <button
              key={type}
              onClick={() =>
                setUserTypeFilter(type)
              }
              className={`py-3 capitalize border-b-2 ${userTypeFilter === type
                ? "border-black font-semibold"
                : "border-transparent text-zinc-500"
                }`}
            >
              {type} Users
            </button>

          ))}

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-zinc-50 text-xs uppercase text-zinc-500">

                <th className="px-3 py-4">

                  {
                    userTypeFilter === "b2b" && (

                      <input
                        type="checkbox"

                        checked={
                          filteredUsers
                            .filter(
                              (u: any) =>
                                u.customerType === "b2b" &&
                                u.verificationStatus !==
                                "Verified"
                            )
                            .every(
                              (u: any) =>
                                selectedCustomers.includes(
                                  u._id
                                )
                            )
                        }

                        onChange={(e) => {

                          if (e.target.checked) {

                            setSelectedCustomers(

                              filteredUsers

                                .filter(
                                  (u: any) =>
                                    u.customerType === "b2b" &&
                                    u.verificationStatus !==
                                    "Verified"
                                )

                                .map(
                                  (u: any) => u._id
                                )

                            );

                          } else {

                            setSelectedCustomers([]);

                          }

                        }}
                      />

                    )
                  }

                </th>

                <th className="px-6 py-4 text-left">
                  Name
                </th>

                <th className="px-6 py-4 text-left">
                  Email
                </th>





                <th className="px-6 py-4 text-left">
                  Role
                </th>

                <th className="px-6 py-4 text-left">
                  Last Login
                </th>




                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-left">
                  Verification
                </th>


                {loggedUser?.role === "admin" && (

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                )}

              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user: any) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-zinc-50 transition"
                >

                  <td className="px-3 py-4">

                    {
                      userTypeFilter === "b2b" &&
                      user.customerType === "b2b" &&
                      user.verificationStatus !== "Verified" && (

                        <input
                          type="checkbox"

                          checked={
                            selectedCustomers.includes(
                              user._id
                            )
                          }

                          onChange={(e) => {

                            if (e.target.checked) {

                              setSelectedCustomers([
                                ...selectedCustomers,
                                user._id
                              ]);

                            } else {

                              setSelectedCustomers(

                                selectedCustomers.filter(
                                  id => id !== user._id
                                )

                              );

                            }

                          }}
                        />

                      )
                    }

                  </td>

                  {/* NAME */}


                  <td className="px-6 py-4 font-medium">
                    {user.name}
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-zinc-600">
                    {user.email}
                  </td>





                  {/* ROLE */}



                  <td className="px-6 py-4">

                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold

                      ${user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "staff"
                          ? "bg-blue-100 text-blue-700"
                          : user.role === "b2b"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                      }
                    `}>

                      {user.role}

                    </span>

                  </td>

                  {/* LAST LOGIN */}
                  <td className="px-6 py-4 text-sm text-zinc-500">

                    {
                      user.lastLogin

                        ? new Date(user.lastLogin)
                          .toLocaleDateString()

                        : "Never"
                    }

                  </td>

                  {/* ACTIVITY */}




                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {user.status || "Active"}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    {
                      user.customerType === "b2b"
                        ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${user.verificationStatus === "Verified"
                                ? "bg-green-100 text-green-700"
                                : user.verificationStatus === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {user.verificationStatus || "Pending"}
                          </span>
                        )
                        : "-"
                    }

                  </td>

                  {/* ACTIONS */}
                  {loggedUser?.role === "admin" && (

                    <td className="px-6 py-4 text-right">



                      <div className="flex justify-end gap-3">

                        {
                          user.customerType === "b2b" &&
                          user.gstCertificate && (


                            <button
                              onClick={() =>
                                window.open(
                                  `${API_URL}/uploads/gst/${user.gstCertificate}`,
                                  "_blank"
                                )
                              }
                              className="text-[10px] px-2 py-1 rounded-md ..."
                            >
                              GST📄
                            </button>

                          )
                        }

                        {
                          user.customerType === "b2b" &&
                          user.verificationStatus === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  updateVerification(
                                    user._id,
                                    "Verified"
                                  )
                                }
                                className="text-xs px-3 py-1 rounded-lg bg-green-100 text-green-700"
                              >
                                Approve
      </button>

                              <button
                                onClick={() =>
                                  updateVerification(
                                    user._id,
                                    "Rejected"
                                  )
                                }
                                className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700"
                              >
                                Reject
      </button>
                            </>
                          )
                        }

                        {loggedUser?.role === "admin" && (


                          <button
                            onClick={() => toggleStatus(user)}
                            className={`text-xs px-3 py-1 rounded-lg ${user.status === "Active"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                              }`}
                          >
                            {user.status === "Active"
                              ? "Disable"
                              : "Enable"}
                          </button>

                        )}



                        {loggedUser?.role === "admin" && (

                          <button
                            onClick={() => openEditUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                        )}

                        {loggedUser?.role === "admin" && (

                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        )}

                      </div>

                    </td>
                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      { editingUser && loggedUser?.role === "admin" && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">

            <h2 className="text-xl font-bold mb-6">
              Edit User
    </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                className="border rounded-xl px-4 py-3"
                placeholder="Name"
              />

              <input
                value={editEmail}
                onChange={(e) =>
                  setEditEmail(e.target.value)
                }
                className="border rounded-xl px-4 py-3"
                placeholder="Email"
              />

            </div>

            <select
              value={editRole}
              onChange={(e) =>
                setEditRole(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 mt-4"
            >
              <option value="admin">
                Admin
      </option>

              <option value="staff">
                Staff
      </option>
            </select>

            {editRole !== "admin" && (

              <div className="border rounded-2xl p-4 mt-4">

                <h4 className="font-semibold mb-3">
                  Permissions
      </h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                  {permissionList.map((permission) => (

                    <label
                      key={permission}
                      className="flex items-center gap-2 text-sm"
                    >

                      <input
                        type="checkbox"
                        checked={editPermissions.includes(permission)}
                        onChange={() => {

                          if (
                            editPermissions.includes(permission)
                          ) {

                            setEditPermissions(
                              editPermissions.filter(
                                (p) => p !== permission
                              )
                            );

                          } else {

                            setEditPermissions([
                              ...editPermissions,
                              permission
                            ]);

                          }

                        }}
                      />

                      {permission}

                    </label>

                  ))}

                </div>

              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setEditingUser(null)
                }
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
      </button>

              <button
                onClick={saveEditedUser}
                className="px-4 py-2 bg-green-600 text-white rounded-xl"
              >
                Save Changes
      </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
