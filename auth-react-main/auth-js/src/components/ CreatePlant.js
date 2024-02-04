import React, { useState, useEffect } from 'react';
import axios from 'axios';


const CreatePlant = ({ onPlantCreated, isEditing, categories, setCategories }) => {
    const initialState = {
        name: '',
        description: '',
        category: '',
    };

    const [plantData, setPlantData] = useState(initialState);
    const [errors, setErrors] = useState(initialState);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4100/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setPlantData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        Object.entries(plantData).forEach(([key, value]) => {
            if (value.trim() === '' && key !== 'category') {
                newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreatePlant = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            let newCategoryResponse;

            const categoryExists = categories.find((cat) => cat.name === plantData.category);

            if (!categoryExists) {
                // If the category doesn't exist, create a new one
                newCategoryResponse = await axios.post('http://localhost:4100/api/categories', {
                    name: plantData.category,
                });

                setCategories([...categories, newCategoryResponse.data]);
            }

            // Now, create the plant
            const response = await axios.post('http://localhost:4100/api/plants', {
                name: plantData.name,
                description: plantData.description,
                categoryId: categoryExists ? categoryExists._id : newCategoryResponse.data._id,
            });

            const newPlant = response.data;
            onPlantCreated(newPlant);
            setPlantData(initialState);
        } catch (error) {
            console.error('Error creating plant:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleCreatePlant}>
                {Object.entries(plantData).map(([key, value]) => (
                    <label key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        {key === 'category' ? (
                            <select name="category" value={value} onChange={handleInputChange}>
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input type="text" name={key} value={value} onChange={handleInputChange} disabled={isEditing} />
                        )}
                        <span style={{ color: 'red' }}>{errors[key]}</span>
                    </label>
                ))}
                <button type="submit" disabled={isEditing}>
                    Create Plant
                </button>
            </form>
        </div>
    );
};

export default CreatePlant;
