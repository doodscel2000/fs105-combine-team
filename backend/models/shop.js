const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Automatically generate a unique ObjectId
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3, // Minimum length for shop name
        maxlength: 100, // Maximum length for shop name
    },
    desc: {
        type: String,
        required: true,
        trim: true,
        minlength: 10, // Minimum length for description
        maxlength: 500, // Maximum length for description
    },
    slug: {
        type: String,
        required: true,
        unique: true, // Ensure the slug is unique for each shop
        trim: true, // Trim whitespace
        lowercase: true, // Convert to lowercase for URL consistency
        minlength: 3, // Minimum length for slug
        maxlength: 100, // Maximum length for slug
    },
    categories: {
        type: [String], // Array of strings for categories
        required: true, // Required to ensure the shop belongs to at least one category
        validate: {
            validator: function(v) {
                return v.length > 0; // Ensure the array has at least one category
            },
            message: 'A shop must have at least one category.'
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User schema
        required: true, // A shop must have an owner
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Pre-save hook to create slug from name
shopSchema.pre('save', function(next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').slice(0, 100); // Replace spaces with hyphens and limit length
    }
    next();
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
