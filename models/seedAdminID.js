const mongoose = require('mongoose');
const { ValidAdminID } = require('./admin.model');

mongoose
  .connect('mongodb://localhost:27017/BLOOD_BANK_DB2')
  .then(async () => {
    const existing = await ValidAdminID.findOne({ adminID: '1603' });
    if (!existing) {
      await ValidAdminID.create({ adminID: '1603' });
      console.log('✅ Admin ID 1603 added to DB.');
    } else {
      console.log('⚠️ Admin ID 1603 already exists in DB.');
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
  });

