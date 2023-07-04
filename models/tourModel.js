const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxLength: [40, 'A tour name must be than or equal to 40 characters'],
            minLength: [10, 'A tour name must be more than or equal to 10 characters'],
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, or difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type:Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    // "this" keyword points to current doc on NEW document creation, not update. Will only work with update if you take a complex workaround
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary:  {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            // GeoJSON geolocation
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number], // long, lat
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    }, 
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

// tourSchema.index({price: 1})
tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create() but not insertMany, findByIdAndUpdate, or findOneAndUpdate...
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true }) // this is the currently document being saved
    next();
});

// tourSchema.pre('save', function(next) {
//     console.log('Will save document...');
//     next();
// })

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });

    next();
})

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    // console.log(docs);
    next();
});


// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    
    // console.log(this.pipeline());
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;