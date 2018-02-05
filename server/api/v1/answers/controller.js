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

/**
 * @api {get} /answers List Answers
 * @apiName GetAnswer
 * @apiGroup Answer
 * 
 * @apiParam {String} limit limit
 * @apiParam {String} skip skip
 *
 * @apiSuccess {String} _id         unique ID of the Answer.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Answer.
 * @apiSuccess {String} updateAt    Last update date of the Answers.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *    "data": [
 *        {
 *           "_id": "5a776c212bde8e12030cca7d",
 *           "text": "Respuesta 1",
 *           "user": {
 *               "firstname": "Rodolfo",
 *               "lastname": "Carcamo",
 *               "email": "rodo@gmail.com",
 *               "createdAt": "2018-02-04T20:03:27.398Z",
 *               "updatedAt": "2018-02-04T20:03:27.398Z",
 *               "__v": 0
 *           },
 *           "createdAt": "2018-02-04T20:25:05.246Z",
 *           "updatedAt": "2018-02-04T20:25:05.246Z",
 *           "__v": 0
 *       }
 *   ],
 *   "limit": 10,
 *   "skip": 0,
 *    "count": 1
 *}
 *
 * @apiError Document Not Found the id of the Answer was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Document Not Found"
 *     }
 */
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

/**
 * @api {post} /answers Create Answer
 * @apiName PostAnswer
 * @apiGroup Answer
 *
 * @apiParam {String} text Text.
 * @apiParam {String} user unique ID of the User.
 *
 * @apiSuccess {String} _id         unique ID of the Answer.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Answer.
 * @apiSuccess {String} updateAt    Last update date of the Answer.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *   "_id": "5a776c212bde8e12030cca7d",
 *   "text": "Respuesta 1",
 *   "user": "5a77670f2bde8e12030cca7c",
 *   "createdAt": "2018-02-04T20:25:05.246Z",
 *   "updatedAt": "2018-02-04T20:25:05.246Z",
 *   "__v": 0
 *}
 *
 * @apiError Document Not Found the id of the Answer was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Document Not Found"
 *     }
 */
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
 * @api {get} /answers/:id Get Answer Id
 * @apiName GetAnsweId
 * @apiGroup Answer
 *
 * @apiParam {String} id Answer unique ID.
 *
 * @apiSuccess {String} _id         unique ID of the Answer.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Answer.
 * @apiSuccess {String} updateAt    Last update date of the Answer.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *   "_id": "5a776c212bde8e12030cca7d",
 *   "text": "Respuesta 1",
 *   "user": "5a77670f2bde8e12030cca7c",
 *   "createdAt": "2018-02-04T20:25:05.246Z",
 *   "updatedAt": "2018-02-04T20:25:05.246Z",
 *   "__v": 0
 *}
 *
 * @apiError Document Not Found the id of the Answer was not found.
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

/**
 * @api {put} /answers/:id Update Answer
 * @apiName PutAnswer
 * @apiGroup Answer
 *
 * @apiParam {String} id Answer unique ID.
 * @apiParam {String} text text.
 * @apiParam {String} user User unique ID.
 *
 * @apiSuccess {String} _id         unique ID of the Answer.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Answer.
 * @apiSuccess {String} updateAt    Last update date of the Answer.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *   "_id": "5a776c212bde8e12030cca7d",
 *   "text": "Respuesta 1",
 *   "user": "5a77670f2bde8e12030cca7c",
 *   "createdAt": "2018-02-04T20:25:05.246Z",
 *   "updatedAt": "2018-02-04T20:25:05.246Z",
 *   "__v": 0
 *}
 *
 * @apiError Document Not Found the id of the Answer was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Document Not Found"
 *     }
 */
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

/**
 * @api {delete} /answers/:id Delete Answer
 * @apiName DeleteAnswer
 * @apiGroup Answer
 *
 * @apiParam {String} id Answer unique ID.
 *
 * @apiSuccess {String} _id         unique ID of the Answer.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Answer.
 * @apiSuccess {String} updateAt    Last update date of the Answer.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *   "_id": "5a776c212bde8e12030cca7d",
 *   "text": "Respuesta 1",
 *   "user": "5a77670f2bde8e12030cca7c",
 *   "createdAt": "2018-02-04T20:25:05.246Z",
 *   "updatedAt": "2018-02-04T20:25:05.246Z",
 *   "__v": 0
 *}
 *
 * @apiError Document Not Found the id of the Answer was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Document Not Found"
 *     }
 */
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