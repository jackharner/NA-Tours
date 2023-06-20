const Tour = require('./../models/tourModel');


exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        // BUILD QUERY
        // 1A) Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        
        // 2B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // "-" means descending
        }

        // 3) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v'); // "-" excludes this field
        }

        // 4) Pagination
        const page = req.query.page * 1 || 1; // convert string to number
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist'); // exit try block into catch block
        }
        
        // EXECUTE QUERY
        const tours = await query; // query gets sent to database and return value gets put in tours variable
        
        // const tours = await Tour.find() // equivalent
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');
        
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // shorthand for Tour.findOne({_id: req.params.id}) 

        res.status(200).json({
            status: 'success',
            data: {
                tours: tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

}

exports.createTour = async (req, res) => {
    try {

    
        // const newTour = new Tour({})
        // newTour.save();

        const newTour = await Tour.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }

}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
        status: 'success',
        data: {
            tour
        }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
        status: 'success',
        data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}