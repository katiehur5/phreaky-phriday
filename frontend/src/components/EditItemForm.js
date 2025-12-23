import React, { useState, useEffect } from 'react';
import API from '../api';
import CreatableSelect from 'react-select/creatable';
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
  const [selectedTags, setSelectedTags] = useState([]);
  const [existingTags, setExistingTags] = useState([]);

  // Fetch existing tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await API.get('/api/items');
        if (response.data.allTags && Array.isArray(response.data.allTags)) {
          setExistingTags(response.data.allTags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

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
      // Set tags if they exist
      if (item.tags && Array.isArray(item.tags)) {
        setSelectedTags(item.tags.map(tag => ({ value: tag, label: tag })));
      } else {
        setSelectedTags([]);
      }
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
      // Add tags to form data
      if (selectedTags.length > 0) {
        const tagValues = selectedTags.map(tag => tag.value || tag);
        form.append('tags', JSON.stringify(tagValues));
      } else {
        form.append('tags', JSON.stringify([]));
      }

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

      <div className="tags-field">
        <label className="field-label">TAGS:</label>
        <CreatableSelect
          isMulti
          isClearable
          isSearchable
          placeholder="Add tags (e.g., Formal💃🏻, Halloween🎃)"
          value={selectedTags}
          onChange={(newValue) => setSelectedTags(newValue || [])}
          options={existingTags.map(tag => ({ value: tag, label: tag }))}
          createOptionPosition="first"
          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '38px',
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: '#f0f0f0',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: '#333',
            }),
          }}
        />
      </div>

      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditItemForm;
