import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    titlu: String
});

const Category = mongoose.model('Category', categorySchema);

export default Category;