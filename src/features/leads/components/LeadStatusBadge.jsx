const LeadStatusBadge = ({ status }) => {
    const getStatusStyles = () => {
      switch (status.toLowerCase()) {
        case 'new':
          return 'bg-blue-100 text-blue-800';
        case 'in progress':
          return 'bg-yellow-100 text-yellow-800';
        case 'qualified':
          return 'bg-green-100 text-green-800';
        case 'unqualified':
          return 'bg-red-100 text-red-800';
        case 'completed':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}>
        {status}
      </span>
    );
  };
  
  export default LeadStatusBadge;