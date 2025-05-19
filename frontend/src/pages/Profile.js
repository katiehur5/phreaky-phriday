import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Profile.css';
import Navbar from '../components/Navbar';
import ProfileMasonryGrid from '../components/ProfileMasonryGrid';

function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await API.get(`/users/${userId}`);
        console.log("User data:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    }

    fetchUser();
  }, [userId]);


  if (!user) return <p>Loading...</p>;

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this item?");
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem('token');
        await API.delete(`/items/${itemId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        // Update local state to remove deleted item
        setUser(prevUser => ({
        ...prevUser,
        items: prevUser.items.filter(item => item._id !== itemId),
        }));
    } catch (error) {
        console.error("Error deleting item:", error);
        alert("Something went wrong. Could not delete item.");
    }
    };

  return (
    <div className="profile-wrapper">
        <Navbar />
    <div className="profile-container">
      <h1>{user.name}'s Closet</h1>
      <p>Email: {user.email}</p>
      <div className="profile-items">
        {user.items?.length ? (
          <ProfileMasonryGrid items={user.items} onDelete={handleDelete} />
        ) : (
          <p>This closet is empty</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Profile;
