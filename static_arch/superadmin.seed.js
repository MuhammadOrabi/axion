const config = require("../config/index.config");

// Purpose: Seed data for superadmin user.
module.exports = {
  user: {
    username: 'admin', 
    email: 'admin@mail.com', 
    password: config.dotEnv.SUPER_ADMIN_INITIAL_PASSWORD, 
    role: 'super_admin',
  }
};