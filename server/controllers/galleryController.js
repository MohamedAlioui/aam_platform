import GalleryImage from '../models/GalleryImage.js';

export const getImages = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { url, title_ar, title_fr, category, featured } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'Image URL is required' });

    const image = await GalleryImage.create({
      url,
      title_ar,
      title_fr,
      category: category || 'collection',
      featured: featured === true || featured === 'true',
    });

    res.status(201).json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
