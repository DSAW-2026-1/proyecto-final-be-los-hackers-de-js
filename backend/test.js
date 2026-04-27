const registerAdmin = require('./routes/auth/admin/register');

console.log(await registerAdmin("admin", "admin"))