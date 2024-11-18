// const mongoose = require('mongoose');
// const reservationSchema = new mongoose.Schema({
//     book: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Book',
//         required: true,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'approved', 'rejected'],
//         default: 'pending'
    
//     }
    
// });
// const Reservation = mongoose.model('Reservation', reservationSchema);
// module.exports = Reservation;
