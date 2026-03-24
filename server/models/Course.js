import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title_ar: {
    type: String,
    required: [true, 'Arabic title is required'],
    trim: true
  },
  title_fr: {
    type: String,
    required: [true, 'French title is required'],
    trim: true
  },
  description_ar: {
    type: String,
    required: [true, 'Arabic description is required']
  },
  description_fr: {
    type: String,
    required: [true, 'French description is required']
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['مبتدئ', 'متوسط', 'متقدم', 'Débutant', 'Intermédiaire', 'Avancé'],
    required: true
  },
  category: {
    type: String,
    enum: ['تصميم', 'خياطة', 'تسويق', 'مولاج', 'كورساج', 'فستان الزفاف', 'تجميل', 'Design', 'Couture', 'Marketing', 'Moulage', 'Corsage', 'Robe de Mariée', 'Beauté', '6ix Streetwear'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  instructor: {
    name: { type: String, required: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  curriculum: [{
    week: Number,
    topic_ar: String,
    topic_fr: String
  }],
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

// Virtual for available seats
courseSchema.virtual('availableSeats').get(function () {
  return this.seats - this.enrolledCount;
});

courseSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Course', courseSchema);
