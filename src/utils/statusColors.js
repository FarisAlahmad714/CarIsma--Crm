export const getStatusColor = (status) => {
    const colors = {
      'Newly Created': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Unqualified': 'bg-red-100 text-red-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Available': 'bg-green-100 text-green-800',
      'In Service': 'bg-yellow-100 text-yellow-800',
      'Sold': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };