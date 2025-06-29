import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Profile.css';
import Navbar from '../components/Navbar';
import MasonryGrid from '../components/MasonryGrid';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [likedItems, setLikedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await API.get(`/api/users/${userId}`);
        setUser(res.data);
        
        // Set liked items based on the current user's likes
        const currentUserId = localStorage.getItem('userId');
        if (currentUserId) {
          setLikedItems(res.data.items
            .filter(item => item.likes.some(like => like.toString() === currentUserId))
            .map(item => item._id)
          );
        }
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
        itemCount: prevUser.itemCount - 1,
        }));
    } catch (error) {
        console.error("Error deleting item:", error);
        alert("Something went wrong. Could not delete item.");
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      const response = await API.put(`/api/items/${itemId}/toggle-availability`);
      setUser(prevUser => ({
        ...prevUser,
        items: prevUser.items.map(item =>
          item._id === itemId ? { ...item, isAvailable: response.data.isAvailable } : item
        ),
        }));
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleLike = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like items.');
      navigate('/login');
      return;
    }
    
    try {
      const response = await API.post(`/api/items/${itemId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the item's likes in local state
      setUser(prevUser => ({
        ...prevUser,
        items: prevUser.items.map(item =>
          item._id === itemId ? { ...item, likes: response.data.item.likes } : item
        ),
      }));

      // Update likedItems state
      setLikedItems(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } catch (err) {
      console.error('Error liking item:', err);
    }
  };

  return (
    <div className="profile-wrapper">
        <Navbar />
    <div className="profile-container">
      <h1>{user.name}'s Closet ({ user.itemCount || 0 })</h1>
      <p><strong>Email:</strong>{' '}
        <a className="contact-link" href={`mailto:${user.email}`}>
            {user.email}
        </a>
      </p>
      <p><strong>Digits:</strong>{' '}
        <a className="contact-link" href={`sms:${user.phoneNumber}`}>
          {user.phoneNumber}</a>
      </p>
      <div className="profile-items">
        {user.items?.length ? (
          <MasonryGrid 
            items={user.items} 
            onToggleAvailability={toggleAvailability} 
            onDelete={handleDelete}
            onLike={handleLike}
            likedItems={likedItems}
          />
        ) : (
          <p>Where your clothes at? ಠ_ಠ</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Profile;
