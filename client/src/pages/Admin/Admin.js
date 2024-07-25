import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import DataTable from "../../components/common/DataTable/DataTable";

const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg-lg shadow-lg max-w-md w-full p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-700">&times;</button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const UserForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: 'user',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        username: initialData.username,
        email: initialData.email,
        password: '',
        roles: initialData.roles,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div className="col-span-1">
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div className="col-span-1">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div className="col-span-1">
        <label className="block text-gray-700">{initialData ? 'New Password (optional)' : 'Password'}</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder={initialData ? 'Leave blank to keep current password' : ''}
          required={!initialData}
        />
      </div>
      <div className="col-span-1">
        <label className="block text-gray-700">Roles</label>
        <select
          name="roles"
          value={formData.roles}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="col-span-2 flex justify-end">
        <button type="button" onClick={onClose} className="btn btn-secondary mr-2">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};


const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div>
      <p>Are you sure you want to delete this user?</p>
      <div className="flex justify-end mt-4">
        <button onClick={onCancel} className="btn btn-secondary mr-2">
          Cancel
        </button>
        <button onClick={onConfirm} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [formType, setFormType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const { roles } = useSelector((state) => state.user.payload);

  const fetchUserss = async (roles) => {
    const url = `${process.env.REACT_APP_API_URL}/api/users/user_lists`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roles }),
      credentials: 'include',
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    return data;
  };

  const createUser = async (roles, formData) => {
    const url = `${process.env.REACT_APP_API_URL}/api/users/create_user`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roles, formData }),
      credentials: 'include',
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Failed to add user`);

    const data = await res.json();
    return data;
  };

  const updateUser = async (roles, formData) => {
    const url = `${process.env.REACT_APP_API_URL}/api/users/update_user/${formData.id}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roles, formData }),
      credentials: 'include',
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Failed to update user`);
    const data = await res.json();
    return data;
  };

  const deleteUser = async (roles, userId) => {
    const url = `${process.env.REACT_APP_API_URL}/api/users/delete_user/${userId}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roles }),
      credentials: 'include',
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Failed to delete user with id ${userId}`);
    const data = await res.json();
    return data.message;
  };

  const fetchUsers = useCallback(async () => {
    try {
      const data = await fetchUserss(roles);
      setUsers(data.userList);
    } catch (error) {
      console.error(error.message);
    }
  }, [roles]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { field: "username", type: "string", headerName: "Username", width: 150 },
    { field: "email", type: "string", headerName: "Email", width: 200 },
    { field: "roles", type: "string", headerName: "Roles", width: 150, options: ["admin", "user"] },
    { field: "createdAt", type: "string", headerName: "Created at", width: 200 },
  ];

  const userRows = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    createdAt: user.createdAt,
  }));

  const handleAddUser = async (formData) => {
    try {
      const data = await createUser(roles, formData);
      setUsers([...users, data.user]);
      setNotification(data.message);
    } catch (error) {
      setNotification(`Error adding user: ${error.message}`);
    } finally {
      setModalOpen(false);
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      const data = await updateUser(roles, formData);
      setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
      setNotification(data.message);
    } catch (error) {
      setNotification(`Error updating user: ${error.message}`);
    } finally {
      setModalOpen(false);
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const confirmDeleteUser = async () => {
    try {
      const message = await deleteUser(roles, userToDelete.id);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setNotification(message);
    } catch (error) {
      setNotification(`Error: ${error.message}`);
    } finally {
      setDeleteModalOpen(false);
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setFormType("update");
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setFormType("add");
    setModalOpen(true);
  };

  return (
    <div className="users p-5 h-full flex flex-col">
      <div className="info flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          className="btn btn-sm bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={handleAdd}
        >
          Add New User
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <DataTable
          slug="users"
          columns={columns}
          rows={userRows}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />
      </div>

      <Modal isOpen={modalOpen} title={formType === "add" ? "Add User" : "Update User"} onClose={() => setModalOpen(false)}>
        <UserForm
          initialData={selectedUser}
          onSubmit={formType === "add" ? handleAddUser : handleUpdateUser}
          onClose={() => setModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={deleteModalOpen} title="Delete User" onClose={() => setDeleteModalOpen(false)}>
        <DeleteConfirmation
          onConfirm={confirmDeleteUser}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </Modal>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Admin;
