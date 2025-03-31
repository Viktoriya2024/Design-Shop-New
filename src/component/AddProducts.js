import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: null });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));

        await axios.post('http://localhost:5000/api/products/add', formData);
        alert('Product Added!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <textarea name="description" placeholder="Description" onChange={handleChange} required />
            <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
            <input name="category" placeholder="Category" onChange={handleChange} required />
            <input type="file" onChange={handleFile} required />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProduct;
