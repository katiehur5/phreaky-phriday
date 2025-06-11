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
        const res = await API.get(`/api/users/${userId}`);
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
        await API.delete(`/api/items/${itemId}`, {
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
      <p><strong>Email:</strong>{' '}
        <a className="contact-link" href={`mailto:${user.email}`}>
            {user.email}
        </a>
      </p>
      <p><strong>Digits:</strong>{' '}
        <a className="contact-link" href={`sms:${user.phoneNumber}`}>
          {user.phoneNumber}</a>
      </p>
      {/* <p>Email: {user.email}</p>
      <p>Digits: {user.phoneNumber}</p> */}
      <div className="profile-items">
        {user.items?.length ? (
          <ProfileMasonryGrid items={user.items} onDelete={handleDelete} />
        ) : (
          <p>Where your clothes at? ಠ_ಠ</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Profile;
