import mongoose from 'mongoose';

const postingSchema = new mongoose.Schema({
    titlu: String,
    creator: String,
    data: Date,
    continut: String,
    categorie: String
});

const Posting = mongoose.model('Posting', postingSchema);

export default Posting;