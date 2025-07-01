const companyDataHandler = {
  BASE_URL: 'https://i-mgmt-official.com/backend',

  // All your database table endpoints mapped to PHP adminHandler actions
  API_ENDPOINTS: {
    // Companies
    companies: '/admin/adminHandler.php?action=fetch_companies',
    companyById: '/admin/adminHandler.php?action=fetch_company_by_id',
    addCompany: '/admin/adminHandler.php?action=add_companies',
    updateCompany: '/admin/adminHandler.php?action=update_company',
    deleteCompany: '/admin/adminHandler.php?action=delete_company',

    // Company-specific data (these use session companyId in PHP)
    companyDetails: '/admin/adminHandler.php?action=fetchCompanyDetails',
    
    // Company settings & design
    companySettings: '/admin/adminHandler.php?action=fetchcompanySettings',
    updateCompanySetting: '/admin/adminHandler.php?action=updatecompanySetting',
    companyDesignSettings: '/admin/adminHandler.php?action=fetchDesignSettings',
    saveDesignSettings: '/admin/adminHandler.php?action=saveDesignSettings',
    
    // Company general info & logos
    saveGeneralInfo: '/admin/adminHandler.php?action=saveGeneralInfo',
    companyLogos: '/admin/adminHandler.php?action=fetchLogo',
    uploadLogo: '/admin/adminHandler.php?action=uploadLogo',
    
    // Departments
    departments: '/admin/adminHandler.php?action=getDepartments',
    saveDepartments: '/admin/adminHandler.php?action=saveDepartmentInfo',
    deleteDepartment: '/admin/adminHandler.php?action=deleteDepartment',
    fetchDepartments: '/admin/adminHandler.php?action=fetchDepartments',
    departmentNames: '/admin/adminHandler.php?action=fetchDepartmentName',
    
    // Department descriptions
    departmentDescriptions: '/admin/adminHandler.php?action=getKuerzelList',
    saveDepartmentDescriptions: '/admin/adminHandler.php?action=saveDepartmentDescriptions',
    fetchDepartmentDescriptionsModal: '/admin/adminHandler.php?action=fetchDepartmentDescriptions',
    saveDepartmentDescriptionsModal: '/admin/adminHandler.php?action=saveDepartmentDescriptionsmodal',
    deleteDepartmentDescription: '/admin/adminHandler.php?action=deleteDepartmentDescription',
    
    // Department function details
    departmentFunctionDetails: '/admin/adminHandler.php?action=fetchFunctionDetails',
    updateFunctionDetail: '/admin/adminHandler.php?action=updateFunctionDetail',
    
    // Functions bullets
    functionsBullets: '/admin/adminHandler.php?action=fetchSubDescriptionBullets',
    updateFunctionBullet: '/admin/adminHandler.php?action=updateFunctionBullet',
    deleteFunctionBullet: '/admin/adminHandler.php?action=deleteFunctionBullet',
    
    // Company users
    companyUsers: '/admin/adminHandler.php?action=fetchUsers',
    importUsers: '/admin/adminHandler.php?action=importUsers',
    exportUsers: '/admin/adminHandler.php?action=exportUsers',
    deleteUser: '/admin/adminHandler.php?action=deleteUser',
    updateUserDetail: '/admin/adminHandler.php?action=updateUserDetail',
    saveIndividualUser: '/admin/adminHandler.php?action=saveIndividualUser',
    getNewUserRow: '/admin/adminHandler.php?action=getNewUserRow',
    fetchMetaData: '/admin/adminHandler.php?action=fetchMetaData',
    fetchUsersByDepartment: '/admin/adminHandler.php?action=fetchUsersByDepartment',
    
    // User role levels
    userRoleLevels: '/admin/adminHandler.php?action=fetchRoleAndLevel',
    fetchValidRoles: '/admin/adminHandler.php?action=fetchValidRoles',
    updateRoleAndLevel: '/admin/adminHandler.php?action=updateRoleAndLevel',
    importRoleAndLevel: '/admin/adminHandler.php?action=importRoleAndLevel',
    exportRoleAndLevel: '/admin/adminHandler.php?action=exportRoleAndLevel',
    
    // Company processes
    companyProcesses: '/admin/adminHandler.php?action=fetch_processes',
    saveProcesses: '/admin/adminHandler.php?action=saveProcess',
    deleteProcess: '/admin/adminHandler.php?action=deleteProcess',
    fetchColors: '/admin/adminHandler.php?action=fetchColor',
    
    // Process descriptions
    processDescriptions: '/admin/adminHandler.php?action=fetchProcessDescription',
    saveProcessDescription: '/admin/adminHandler.php?action=saveProcessDescription',
    
    // Subprocesses
    subprocesses: '/admin/adminHandler.php?action=fetchSubprocesses',
    saveSubprocesses: '/admin/adminHandler.php?action=saveSubprocesses',
    deleteSubprocess: '/admin/adminHandler.php?action=deleteSubprocess',
    
    // Capacity management
    capacityData: '/admin/adminHandler.php?action=fetchKapazitaet',
    updateCapacity: '/admin/adminHandler.php?action=updateKapazitaet',
    importCapacity: '/admin/adminHandler.php?action=importKapazitaet',
    exportCapacity: '/admin/adminHandler.php?action=exportKapazitaet',
    
    // Instructions
    instructions: '/admin/adminHandler.php?action=fetchInst',
    addInstruction: '/admin/adminHandler.php?action=addInstruction',
    fetchInstructionDetails: '/admin/adminHandler.php?action=fetchInstDetails',
    saveInstructionStep: '/admin/adminHandler.php?action=route',
    deleteInstructionStep: '/admin/adminHandler.php?action=deleteStep',
    
    // Ratings (implied from your database structure)
    ratings: '/admin/adminHandler.php?action=fetch_companies', // ratings come with companies
  },

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const defaultOptions = {
      method: 'GET',
      credentials: 'include', // Important for session handling
      ...options
    };

    try {
      console.log(`🔄 API Call: ${defaultOptions.method} ${url}`);
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  },

  // Method to fetch ALL company-related data at once
  async fetchAllCompanyData(companyId) {
    console.log(`🚀 Fetching all data for company ${companyId}...`);
    
    // First, we need to set the company in session (this is how your PHP works)
    await this.setCompanySession(companyId);
    
    // Define which endpoints to fetch (these use session companyId in PHP)
    const dataFetchPromises = [
      // Company basic info
      { key: 'companyDetails', promise: this.fetchCompanyDetails() },
      { key: 'companySettings', promise: this.fetchCompanySettings() },
      { key: 'companyDesignSettings', promise: this.fetchDesignSettings() },
      { key: 'companyLogos', promise: this.fetchLogo() },
      
      // Departments and related data
      { key: 'departments', promise: this.fetchDepartments() },
      { key: 'departmentDescriptions', promise: this.fetchDepartmentDescriptions() },
      
      // Users and roles
      { key: 'companyUsers', promise: this.fetchUsers() },
      { key: 'userRoleLevels', promise: this.fetchRoleAndLevel() },
      { key: 'validRoles', promise: this.fetchValidRoles() },
      
      // Processes
      { key: 'companyProcesses', promise: this.fetchProcesses() },
      
      // Capacity data
      { key: 'capacityData', promise: this.fetchKapazitaet() },
      
      // Instructions
      { key: 'instructions', promise: this.fetchInstructions() },
    ];

    // Execute all requests in parallel
    const results = await Promise.allSettled(
      dataFetchPromises.map(({ promise }) => promise)
    );

    // Process results
    const companyData = {};
    results.forEach((result, index) => {
      const { key } = dataFetchPromises[index];
      if (result.status === 'fulfilled') {
        companyData[key] = result.value;
      } else {
        console.error(`❌ Failed to fetch ${key}:`, result.reason);
        companyData[key] = null; // or empty array/object as appropriate
      }
    });

    console.log('✅ All company data fetched:', companyData);
    return companyData;
  },

  // Helper to set company session (you might need this depending on your PHP session handling)
  async setCompanySession(companyId) {
    // This might be needed to set the session company ID in PHP
    // You might need to add an endpoint in your PHP for this
    const formData = new FormData();
    formData.append('company_id', companyId);
    
    try {
      await this.makeRequest('/admin/setCompanySession.php', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.warn('⚠️ Could not set company session, using existing session');
    }
  },

  // Individual fetch methods for each data type
  async fetchCompanyDetails() {
    return this.makeRequest(this.API_ENDPOINTS.companyDetails, { method: 'POST' });
  },

  async fetchCompanySettings() {
    return this.makeRequest(this.API_ENDPOINTS.companySettings);
  },

  async fetchDesignSettings() {
    return this.makeRequest(this.API_ENDPOINTS.companyDesignSettings);
  },

  async fetchLogo() {
    return this.makeRequest(this.API_ENDPOINTS.companyLogos);
  },

  async fetchDepartments() {
    return this.makeRequest(this.API_ENDPOINTS.departments);
  },

  async fetchDepartmentDescriptions() {
    return this.makeRequest(this.API_ENDPOINTS.departmentDescriptions);
  },

  async fetchUsers() {
    return this.makeRequest(this.API_ENDPOINTS.companyUsers);
  },

  async fetchRoleAndLevel() {
    return this.makeRequest(this.API_ENDPOINTS.userRoleLevels);
  },

  async fetchValidRoles() {
    return this.makeRequest(this.API_ENDPOINTS.fetchValidRoles);
  },

  async fetchProcesses(mainprocess = 'prozesse') {
    const formData = new FormData();
    formData.append('mainprocess', mainprocess);
    return this.makeRequest(this.API_ENDPOINTS.companyProcesses, {
      method: 'POST',
      body: formData
    });
  },

  async fetchKapazitaet() {
    return this.makeRequest(this.API_ENDPOINTS.capacityData);
  },

  async fetchInstructions() {
    return this.makeRequest(this.API_ENDPOINTS.instructions);
  },

  // CRUD operations for each data type
  async updateCompanyData(endpoint, data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.makeRequest(endpoint, {
      method: 'POST',
      body: formData
    });
  },

  async deleteCompanyData(endpoint, id) {
    const formData = new FormData();
    formData.append('id', id);

    return this.makeRequest(endpoint, {
      method: 'POST',
      body: formData
    });
  },

  // Specific methods for common operations
  async addUser(userData) {
    return this.updateCompanyData(this.API_ENDPOINTS.saveIndividualUser, {
      userData: JSON.stringify(userData)
    });
  },

  async updateUser(id, columnOrName, value) {
    return this.updateCompanyData(this.API_ENDPOINTS.updateUserDetail, {
      id,
      column: columnOrName,
      value
    });
  },

  async deleteUser(id) {
    return this.deleteCompanyData(this.API_ENDPOINTS.deleteUser, id);
  },

  async saveDepartments(departments) {
    const formData = new FormData();
    departments.forEach((dept, index) => {
      formData.append(`id[${index}]`, dept.id || '');
      formData.append(`name[${index}]`, dept.name);
      formData.append(`kuerzel[${index}]`, dept.kuerzel);
      formData.append(`bereich[${index}]`, dept.bereich);
    });

    return this.makeRequest(this.API_ENDPOINTS.saveDepartments, {
      method: 'POST',
      body: formData
    });
  },

  async saveProcesses(processes) {
    return this.updateCompanyData(this.API_ENDPOINTS.saveProcesses, {
      processes: JSON.stringify(processes)
    });
  },

  // Utility method to get fresh data for specific tables only
  async refreshTableData(tableNames = []) {
    const refreshPromises = tableNames.map(tableName => {
      switch(tableName) {
        case 'companyUsers':
          return { key: tableName, promise: this.fetchUsers() };
        case 'departments':
          return { key: tableName, promise: this.fetchDepartments() };
        case 'companyProcesses':
          return { key: tableName, promise: this.fetchProcesses() };
        // Add more cases as needed
        default:
          return null;
      }
    }).filter(Boolean);

    const results = await Promise.allSettled(
      refreshPromises.map(({ promise }) => promise)
    );

    const refreshedData = {};
    results.forEach((result, index) => {
      const { key } = refreshPromises[index];
      if (result.status === 'fulfilled') {
        refreshedData[key] = result.value;
      }
    });

    return refreshedData;
  }
};

export default companyDataHandler;