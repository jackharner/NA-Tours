const fs = require('fs');


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
}

exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1; // convert string to number
    const tour = tours.find(el => el.id === id);

    // if (id > tours.length) {
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        });
    }


    res.status(200).json({
        status: 'success',
        data: {
            tours: tour
        }
    })
}

exports.createTour = (req, res) => {
    // console.log(req);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    });

}

exports.updateTour = (req, res) => {

    const id = req.params.id * 1; // convert string to number
    let tour = tours.find(el => el.id === id);

    if (id > tours.length || id < 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        });
    }

    tour = req.body;
    tours.splice(id, 1, tour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    });
}

exports.deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
}