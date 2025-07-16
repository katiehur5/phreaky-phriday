import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import '../styles/Profile.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MasonryGrid from '../components/MasonryGrid';
import { useNavigate } from 'react-router-dom';
import EditProfileForm from '../components/EditProfileForm';
import { MdEdit, MdAlternateEmail, MdLocalPhone, MdHome } from "react-icons/md";
import { FaGraduationCap, FaSnapchat, FaPinterest } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { BiLogoVenmo } from "react-icons/bi";

function Profile() {
  const { userId } = useParams(); // profile owner's id
  const [user, setUser] = useState(null); // profile owner's object
  const currentUserId = localStorage.getItem('userId'); // self
  const [likedItems, setLikedItems] = useState([]); // ids of items liked and owned by user
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // for displaying wishlist only if profile owner is self
  const [wishlist, setWishlist] = useState([]); // list of item objects liked by self
  const [wishlistIds, setWishlistIds] = useState([]);
  const isOwner = currentUserId === userId.toString();

  async function fetchUser() {
    try {
      const res = await API.get(`/api/users/${userId}`);
      setUser(res.data);
      
      // Set liked items based on the current user's likes
      if (currentUserId) {
        setLikedItems(res.data.items
          .filter(item => item.likes.some(like => like.toString() === currentUserId)) // if liked by current user
          .map(item => item._id)
        );
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Fetch all items and filter for liked by current user
  async function fetchWishlist() {
    if (!isOwner) return;
    try {
      const res = await API.get('/api/items');
      const liked = res.data.filter(item => item.likes.some(like => like.toString() === currentUserId));
      setWishlist(liked);
      const likedIds = liked.map(item => item._id);
      setWishlistIds(likedIds);
    } catch (err) {
      console.error('Failed to fetch liked items', err);
    }
  }
  useEffect(() => {
    fetchWishlist();
  }, [currentUserId]);

  if (!user) return <p>Loading...</p>;

  const handleDelete = async (itemId) => {

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

      // update wishlist
      setWishlist(prev => {
        return prev.filter(id => id !== itemId);
      });
      setWishlistIds(prev => {
        return prev.filter(id => id !== itemId);
      });
      fetchWishlist();
    } catch (err) {
      console.error('Error liking item:', err);
    }
  };

  return (
    <div className="profile-wrapper">
        <Navbar />
    <div className="profile-container">

      <h1>{user.name}'s closet ({ user.itemCount || 0 })</h1>
        {/* not in edit mode */}
        {isOwner && !isEditing && (
          <span
            className="edit-row">
            <div
              onClick={() => setIsEditing(true)} 
              className="edit-btn">
              <MdEdit />
            </div>
          </span>
        )}

        {/* in edit mode */}
        {isEditing ? (
          <EditProfileForm
            user={user}
            onSave={() => {
              fetchUser();    // refresh item
              setIsEditing(false); // exit edit mode
            }}
            onCancel={() => {
              setIsEditing(false);
            }}
          />
        ) : (
          <div className="profile-info">
            {/* <div className="profile-box"> */}
              
              <div className="profile-pill">
                <p>
                  <MdAlternateEmail />{' '}
                  <a className={`contact-link${user.email && user.email.includes('*') ? ' preferred-contact' : ''}`} href={`mailto:${user.email.replace("*","")}`}>
                      {user.email}
                  </a>
                </p>
              </div>

              <div className="profile-pill">
                <p>
                  <MdLocalPhone />{' '}
                  <a className={`contact-link${user.phoneNumber && user.phoneNumber.includes('*') ? ' preferred-contact' : ''}`} href={`sms:${user.phoneNumber.replace("*","")}`}>
                    {user.phoneNumber}</a>
                </p>
              </div>
              
                {user.classYear && <div className="profile-pill ">
                  <p>
                  <FaGraduationCap />{' '}
                  {user.classYear}
                </p></div>}
              
                {user.residence && <div className="profile-pill">
                  <p>
                    <MdHome />{' '}
                  {user.residence}
                </p></div>}
        
                {user.insta && <div className="profile-pill">
                  <p>
                    <AiFillInstagram />{' '}
                  <a 
                    className={`contact-link${user.insta && user.insta.includes('*') ? ' preferred-contact' : ''}`} 
                    href={`https://www.instagram.com/${user.insta.replace(/[@*]/g,"")}`} target="_blank" rel="noreferrer">
                    {user.insta}</a>
                </p></div>}
              
                {user.snapchat && <div className="profile-pill">
                  <p>
                    <FaSnapchat />{' '}
                  <a 
                    className={`contact-link${user.snapchat && user.snapchat.includes('*') ? ' preferred-contact' : ''}`} 
                    href={`https://www.snapchat.com/@${user.snapchat.replace(/[@*]/g,"")}`} target="_blank" rel="noreferrer">
                    {user.snapchat}</a>
                </p></div>}
              
                {user.pinterest && <div className="profile-pill">
                  <p>
                    <FaPinterest />{' '}
                  <a className="contact-link" href={`https://www.pinterest.com/${user.pinterest.replace(/[@*]/g,"")}`} target="_blank" rel="noreferrer">
                    {user.pinterest}</a>
                </p></div>}
              
                {user.venmo && <div className="profile-pill">
                  <p>
                    <BiLogoVenmo />{' '}
                  <a className="contact-link" href={`https://venmo.com/${user.venmo.replace(/[@*]/g,"")}`} target="_blank" rel="noreferrer">
                    {user.venmo}</a>
                </p></div>}

                {user.style && <div className="profile-pill"><p><strong>Style: </strong>{user.style}</p></div>}
              
                {user.influencer && <div className="profile-pill"><p><strong>Fav influencer: </strong>{user.influencer}</p></div>}
              
            {/* </div> */}
          </div>
        )}

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
      {/* Liked Items Section */}
      {isOwner && (
      <div className="liked-items-section">
        <div className="wishlist-container">
          <h1>Wishlist</h1>
          {wishlist.length > 0 ? (
            <MasonryGrid 
              items={wishlist} 
              onToggleAvailability={toggleAvailability} // No toggle for liked
              onDelete={handleDelete} // No delete for liked
              onLike={handleLike}
              likedItems={wishlistIds}
            />
          ) : (
            <p>So you're the picky type?</p>
          )}
        </div>
      </div>)}
      <Footer />
    </div>
  );
}

export default Profile;
