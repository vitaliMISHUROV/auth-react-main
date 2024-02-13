import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PlantsList from '../components/PlantsList';
import CreatePlant from '../components/ CreatePlant';
import "../ style/PlantsPage.css";

import { SignOutButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

const Plant = () => {
    const [plants, setPlants] = useState([]);
    const [editingPlantId, setEditingPlantId] = useState(null);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4100/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPlants = async () => {
        try {
            const response = await axios.get('http://localhost:4100/api/plants');
            setPlants(response.data);
        } catch (error) {
            console.error('Error fetching plants:', error);
        }
    };

    const createPlant = (newPlant) => {
        setPlants([...plants, newPlant]);
    };

    const editPlantClick = async (plantId) => {
        try {
            const response = await axios.get(`http://localhost:4100/api/plants/${plantId}`);
            const plantDetails = response.data;
            setEditingPlantId(plantId);
        } catch (error) {
            console.error('Error fetching plant details for editing:', error);
        }
    };

    useEffect(() => {
        fetchPlants();
        fetchCategories();
    }, [editingPlantId]);

    const editPlantClose = () => {
        setEditingPlantId(null);
    };

    const editPlant = async (plantId, newName, newDescription) => {
        try {
            await axios.put(`http://localhost:4100/api/plants/${plantId}`, {
                name: newName,
                description: newDescription,
            });

            setEditingPlantId(null);
            setPlants((prevPlants) =>
                prevPlants.map((plant) =>
                    plant._id === plantId ? { ...plant, name: newName, description: newDescription } : plant
                )
            );
        } catch (error) {
            console.error('Error updating plant:', error);
        }
    };

    const deletePlant = (deletedPlantId) => {
        setPlants((prevPlants) => prevPlants.filter((plant) => plant._id !== deletedPlantId));
    };

    return (
        <>
            <div>
                <SignedOut>
                    <SignInButton />
                    <p>This content is public. Only signed-out users can see the SignInButton above this text.</p>
                </SignedOut>
                <SignedIn>
                    <SignOutButton  />
                    <p>content is. Only signed-in users can see the SignOutButton above this text.</p>

                    <div className="plants-page">
                        <div className="plants-list-container">
                            <PlantsList
                                plants={plants}
                                onEditPlant={editPlantClick}
                                onEditSave={editPlant}
                                onEditCancel={editPlantClose}
                                onDeletePlant={deletePlant}
                                categories={categories}
                            />
                        </div>
                        <div className="create-plant-container">
                            <CreatePlant onPlantCreated={createPlant} categories={categories} setCategories={setCategories} />
                        </div>

                    </div>
                </SignedIn>
            </div>
        </>
    );
};


export default Plant;
