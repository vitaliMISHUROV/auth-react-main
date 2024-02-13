import React, { useState, useEffect } from "react";
import axios from "axios";
import  "../ style/PlantsPage.css"
const PlantsList = ({ plants, onDeletePlant, editingPlantId, onEditSave, onEditCancel, categories }) => {
    const [editingPlantDetails, setEditingPlantDetails] = useState({
        name: '',
        description: '',
        category: '',
    });

    const handleDeleteClick = async (plantId) => {
        try {
            await axios.delete(`http://localhost:4100/api/plants/${plantId}`);
            onDeletePlant(plantId);
        } catch (error) {
            console.error('Error deleting plant:', error);
        }
    };

    const handleSaveClick = async (plantId) => {
        try {
            await axios.put(`http://localhost:4100/api/plants/${plantId}`, editingPlantDetails);
            onEditSave(plantId, editingPlantDetails.name, editingPlantDetails.description);
        } catch (error) {
            console.error('Error updating plant:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingPlantDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    return (
        <div>
            <h2>Plants List</h2>
            <ul>
                {plants.map((plant) => (
                    <li key={plant._id}>
                        {editingPlantId === plant._id ? (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingPlantDetails.name}
                                    onChange={handleInputChange}
                                />
                                <select
                                    name="category"
                                    value={editingPlantDetails.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                            </>
                        ) : (
                            <>
                                {plant.name} - {plant.description}
                                <button className="btnDelete"  onClick={() => handleDeleteClick(plant._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlantsList;
