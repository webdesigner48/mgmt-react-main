
const adminHandler = {
  BASE_URL: 'https://i-mgmt-official.com/backend',
  API_ENDPOINTS: {
    Unternehmen: '/admin/adminHandler.php?action=fetch_companies',
    DeleteCompany: '/admin/adminHandler.php?action=delete_company',
    AddCompany: '/admin/adminHandler.php?action=add_company',
  }
};

export default adminHandler;