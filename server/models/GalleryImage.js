import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  title_ar: {
    type: String,
    default: ''
  },
  title_fr: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['haute-couture', 'streetwear', 'evenement', 'etudiant', 'collection'],
    default: 'collection'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('GalleryImage', galleryImageSchema);
