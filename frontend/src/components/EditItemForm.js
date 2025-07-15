import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/AddItem.css'; // reuse existing styles

function EditItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    condition: '',
    swapType: '',
    washInstructions: '',
    price: '',
    category: '',
    subcategory: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        size: item.size || '',
        condition: item.condition || '',
        swapType: item.swapType || '',
        washInstructions: item.washInstructions || '',
        price: item.price || '',
        category: item.category || '',
        subcategory: item.subcategory || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert('Only upload up to 3 additional images');
      return;
    }
    setAdditionalImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('category', formData.category);
      if (formData.subcategory) form.append('subcategory', formData.subcategory);
      if (formData.condition) form.append('condition', formData.condition);
      if (formData.size) form.append('size', formData.size);
      if (formData.swapType) form.append('swapType', formData.swapType);
      if (formData.swapType === 'borrow me' && formData.washInstructions) form.append('washInstructions', formData.washInstructions);
      if (formData.swapType === 'buy me' && formData.price) form.append('price', formData.price);
      if (imageFile) form.append('image', imageFile);
      for (const file of additionalImageFiles) form.append('additionalImages', file);

      await API.put(`/api/items/${item._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // alert('Item updated successfully!');
      if (onSave) onSave();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-item-form">
      <span className="cancel-row">
        <div onClick={onCancel} className="cancel-btn">
          cancel
        </div>
      </span>
      <h2>Edit Item</h2>

      <label className="upload-prompt" htmlFor="imageUpload">+ Replace main photo</label>
      <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
      {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="preview-img" />}

      <label className="upload-prompt" htmlFor="additionalImages">+ Replace/add up to 3 more photos</label>
      <input type="file" id="additionalImages" multiple accept="image/*" onChange={handleAdditionalImagesUpload} style={{ display: 'none' }} />
      {additionalImageFiles.length > 0 && additionalImageFiles.map((file, i) => (
        <img key={i} src={URL.createObjectURL(file)} alt={`Additional ${i + 1}`} className="preview-add-img" />
      ))}

      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" required />

      <div className="options">
        <span className="field-label">CATEGORY:</span>
        {['clothing', 'shoes', 'accessories', 'home goods', 'other'].map((c) => (
          <label key={c} className="radio-option">
            <input type="radio" name="category" value={c} checked={formData.category === c} onChange={handleChange} /> {c}
          </label>
        ))}
      </div>

      {formData.category === 'clothing' && (
        <div className="options">
          <span className="field-label">CLOTHING TYPE:</span>
          {['dress', 'top', 'bottom', 'outerwear', 'other'].map((c) => (
            <label key={c} className="radio-option">
              <input type="radio" name="subcategory" value={c} checked={formData.subcategory === c} onChange={handleChange} /> {c}
            </label>
          ))}
        </div>
      )}

      <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="Size" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />

      <div className="options">
        <span className="field-label">CONDITION:</span>
        {['new', 'good', 'fair', 'poor'].map((c) => (
          <label key={c} className="radio-option">
            <input type="radio" name="condition" value={c} checked={formData.condition === c} onChange={handleChange} /> {c}
          </label>
        ))}
      </div>

      <div className="options">
        <span className="field-label">SWAP TYPE:</span>
        {['buy me', 'take me', 'borrow me'].map((c) => (
          <label key={c} className="radio-option">
            <input type="radio" name="swapType" value={c} checked={formData.swapType === c} onChange={handleChange} /> {c}
          </label>
        ))}
      </div>

      {formData.swapType === 'borrow me' && (
        <input type="text" name="washInstructions" placeholder="Wash Instructions" value={formData.washInstructions} onChange={handleChange} />
      )}

      {formData.swapType === 'buy me' && (
        <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} />
      )}

      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditItemForm;
