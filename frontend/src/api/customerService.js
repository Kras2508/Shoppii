export const customerService = {
  // Get customer statistics using Part 2 functions
  getStatistics: (privateClient) => {
    return privateClient.get('/customer/statistics');
  },

  // Get customer profile with total_spent from function
  getProfile: (privateClient) => {
    return privateClient.get('/customer/profile');
  }
};
