// src/features/inventory/hooks/useInventory.js
import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../../utils/storage';

export const useInventory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVehicles = () => {
    try {
      const storedVehicles = storage.get(STORAGE_KEYS.VEHICLES) || [];
      setVehicles(storedVehicles);
    } catch (err) {
      setError('Failed to load vehicles');
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData) => {
    try {
      const newVehicle = {
        id: Date.now(),
        ...vehicleData,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedVehicles = [...vehicles, newVehicle];
      storage.set(STORAGE_KEYS.VEHICLES, updatedVehicles);
      setVehicles(updatedVehicles);
      return newVehicle;
    } catch (err) {
      setError('Failed to add vehicle');
      throw err;
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    try {
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === id 
          ? { 
              ...vehicle, 
              ...vehicleData, 
              updatedAt: new Date().toISOString() 
            } 
          : vehicle
      );

      storage.set(STORAGE_KEYS.VEHICLES, updatedVehicles);
      setVehicles(updatedVehicles);
      return updatedVehicles.find(vehicle => vehicle.id === id);
    } catch (err) {
      setError('Failed to update vehicle');
      throw err;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
      storage.set(STORAGE_KEYS.VEHICLES, updatedVehicles);
      setVehicles(updatedVehicles);
    } catch (err) {
      setError('Failed to delete vehicle');
      throw err;
    }
  };

  const updateVehicleStatus = async (id, status) => {
    try {
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === id 
          ? { 
              ...vehicle, 
              status, 
              updatedAt: new Date().toISOString() 
            } 
          : vehicle
      );

      storage.set(STORAGE_KEYS.VEHICLES, updatedVehicles);
      setVehicles(updatedVehicles);
      return updatedVehicles.find(vehicle => vehicle.id === id);
    } catch (err) {
      setError('Failed to update vehicle status');
      throw err;
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    updateVehicleStatus,
    refreshVehicles: loadVehicles
  };
};