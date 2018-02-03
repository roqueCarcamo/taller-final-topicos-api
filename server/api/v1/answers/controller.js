const Model = require('./model');

exports.find = (req, res, next, id) => {
    Model.findById(id)
        .then( doc => {
            if(doc){
                req.doc = doc;
                next();
            }else{
                res.status(404).json({
                    message: "Document not found"
                });
            }
        })
        .catch( err => {
            next(new Error(err));
        });
};

exports.all = (req, res, next) => {
    const limit = Number(req.query.limit) || 10;
    const skip = Number(req.query.skip) || 0;
    
    const items = Model
        .find()
        .skip(skip)
        .limit(limit)
        .populate('user');
    
    const count = Model.count();
    
    Promise.all([items.exec(), count.exec()])
        .then( data => {
            res.json({
                data: data[0],
                limit,
                skip,
                count: data[1]
            })
        })
        .catch( err => {
            next(new Error(err));
        });
};

exports.create = (req, res, next) => {
    const body = req.body;
    
    let document = new Model({
        text: body.text,
        user: body.user
    });
    document.save()
        .then( doc => {
            res.json(doc)
        })
        .catch( err => {
            next(new Error(err));
        });
};

/**
 * @api {get} /books/:id Request Book information
 * @apiName GetBook
 * @apiGroup Book
 *
 * @apiParam {String} id Book unique ID.
 *
 * @apiSuccess {String} _id         unique ID of the Book.
 * @apiSuccess {String} title       Title.
 * @apiSuccess {String} description Description.
 * @apiSuccess {String} author      Author of the book.
 * @apiSuccess {String} createdAt   Created date of the book.
 * @apiSuccess {String} updateAt    Last update date of the book.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "_id": "5a63985872e840361145d634",
 *          "title": "Go girl",
 *          "description": "Originally writed by Gillian Flynn",
 *          "author": {
 *              "_id": "5a63929672e840361145d633",
 *              "firstname": "Gustavo",
 *              "lastname": "Morales",
 *              "createdAt": "2018-01-20T19:03:50.638Z",
 *              "updatedAt": "2018-01-20T19:03:50.638Z",
 *              "__v": 0
 *          },
 *          "createdAt": "2018-01-20T19:28:24.046Z",
 *          "updatedAt": "2018-01-20T19:28:24.046Z",
 *          "__v": 0
 *      },
 *
 * @apiError Document Not Found the id of the Book was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Document Not Found"
 *     }
 */

exports.get = (req, res, next) => {
    res.json(req.doc);
};

exports.update = (req, res, next) => {
    let document = Object.assign(req.doc, req.body);
    
    document.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
           next(new Error(err));
        });
};

exports.delete = (req, res, next) => {
    const doc = req.doc;
    
    doc.remove()
        .then( deleted => {
            res.json(deleted);
        })
        .catch( err => {
            next(new Error(err));
        });
};