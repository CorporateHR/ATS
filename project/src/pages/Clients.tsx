import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, Plus, Search } from 'lucide-react';
import type { Client, ClientInsert, SpocInsert } from '../types/temp-types';
import AddClientForm from '../components/AddClientForm';
import EmptyState from '../components/EmptyState';
import useClientsStore from '../store/clients';
import useSpocsStore from '../store/spocs';

interface SpocFormData {
  name: string;
  email: string;
  phone: string;
  type: "internal" | "external";
  designation: string;
}

export default function Clients() {
  const { clients, loading, error, fetchClients, addClient, updateClient, deleteClient } = useClientsStore();
  const { addSpoc } = useSpocsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClient = async (
    clientData: ClientInsert,
    spocData: SpocFormData
  ) => {
    try {
      // First add the client
      const client = await addClient(clientData);
      
      // Then add the SPOC with the client ID
      await addSpoc({
        ...spocData,
        client_id: client.id
      });
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add client:', error);
    }
  };

  const handleUpdateClient = async (id: string, updatedClient: Partial<Client>) => {
    try {
      await updateClient(id, updatedClient);
      setSelectedClient(null);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      setSelectedClient(null);
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading clients: {error}
      </div>
    );
  }

  if (!loading && clients.length === 0 && !showAddForm) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Building2}
          title="No Clients Added Yet"
          description="Start by adding your first client"
          actionLabel="Add Client"
          onAction={() => setShowAddForm(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </button>
        )}
      </div>

      {showAddForm && (
        <AddClientForm
          onSubmit={(clientData, spocData) => handleAddClient(clientData, spocData)}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {client.name}
                </h3>
                <span className="text-sm text-gray-500">{client.industry}</span>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {client.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                {client.contact_email}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-2" />
                {client.contact_phone}
              </div>
              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
