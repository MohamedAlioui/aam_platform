import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['T-Shirt', 'Hoodie', 'Cap', 'Jacket', 'Accessories'],
    required: true
  },
  colors: {
    type: [String],
    default: ['black', 'white']
  },
  sizes: {
    type: [String],
    default: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  images: {
    type: [String],
    default: []
  },
  brand: {
    type: String,
    default: '6ix'
  },
  model3D: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
