import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String, // optional for product display
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);