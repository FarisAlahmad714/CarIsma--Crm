import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../../../utils/storage';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load leads from storage
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    try {
      const storedLeads = storage.get(STORAGE_KEYS.LEADS) || [];
      setLeads(storedLeads);
    } catch (err) {
      setError('Failed to load leads');
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (leadData) => {
    try {
      const newLead = {
        id: Date.now(),
        ...leadData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedLeads = [...leads, newLead];
      storage.set(STORAGE_KEYS.LEADS, updatedLeads);
      setLeads(updatedLeads);
      return newLead;
    } catch (err) {
      setError('Failed to add lead');
      throw err;
    }
  };

  const updateLead = async (id, leadData) => {
    try {
      const updatedLeads = leads.map(lead => 
        lead.id === id 
          ? { 
              ...lead, 
              ...leadData, 
              updatedAt: new Date().toISOString() 
            } 
          : lead
      );

      storage.set(STORAGE_KEYS.LEADS, updatedLeads);
      setLeads(updatedLeads);
      return updatedLeads.find(lead => lead.id === id);
    } catch (err) {
      setError('Failed to update lead');
      throw err;
    }
  };

  const deleteLead = async (id) => {
    try {
      const updatedLeads = leads.filter(lead => lead.id !== id);
      storage.set(STORAGE_KEYS.LEADS, updatedLeads);
      setLeads(updatedLeads);
    } catch (err) {
      setError('Failed to delete lead');
      throw err;
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const updatedLeads = leads.map(lead => 
        lead.id === id 
          ? { 
              ...lead, 
              status, 
              updatedAt: new Date().toISOString() 
            } 
          : lead
      );

      storage.set(STORAGE_KEYS.LEADS, updatedLeads);
      setLeads(updatedLeads);
      return updatedLeads.find(lead => lead.id === id);
    } catch (err) {
      setError('Failed to update lead status');
      throw err;
    }
  };

  return {
    leads,
    loading,
    error,
    addLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
    refreshLeads: loadLeads
  };
};