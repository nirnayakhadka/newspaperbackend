const bcrypt = require('bcrypt');
const sequelize = require('../src/config/db.js');
const Admin = require('../src/models/Admin');


async function createFirstAdmin() {
  try {
    // Sync database
    await sequelize.sync();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { role: 'admin' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username:', existingAdmin.username);
      process.exit(0);
    }

    // Create first admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ First admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('\n⚠️  Please change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createFirstAdmin();