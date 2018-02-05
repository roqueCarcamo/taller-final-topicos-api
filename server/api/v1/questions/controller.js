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
 * @api {get} /questions List Questions
 * @apiName GetQuestion
 * @apiGroup Question
 *
 * @apiParam {String} limit Limit
 * @apiParam {String} skip Skip
 *
 * @apiSuccess {String} _id         unique ID of the Question.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Question.
 * @apiSuccess {String} updateAt    Last update date of the Question.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *           "answer": [
 *               {
 *                   "_id": "5a7621f97e305704a003f908",
 *                    "text": "Respuesta 2",
 *                  "user": "5a76115e18d46c1518302bb1",
 *                   "createdAt": "2018-02-03T20:56:25.059Z",
 *                   "updatedAt": "2018-02-03T20:56:25.059Z",
 *                   "__v": 0
 *              },
 *              {
 *                   "_id": "5a76210a7e82cb032baa4483",
 *                   "text": "Hola respuesta",
 *                   "user": "5a76115e18d46c1518302bb1",
 *                   "createdAt": "2018-02-03T20:52:26.249Z",
 *                   "updatedAt": "2018-02-03T20:52:26.249Z",
 *                   "__v": 0
 *               }
 *           ],
 *           "_id": "5a7620747e82cb032baa4482",
 *           "text": "Nueva pregunta",
 *           "user": {
 *               "firstname": "Rodolfo ",
 *               "lastname": "Cárcamo",
 *               "email": "carcamomesa+2@gmail.com",
 *               "createdAt": "2018-02-03T19:45:34.102Z",
 *               "updatedAt": "2018-02-03T19:45:34.102Z",
 *               "__v": 0
 *           },
 *           "createdAt": "2018-02-03T20:49:56.343Z",
 *           "updatedAt": "2018-02-03T21:02:31.131Z",
 *           "__v": 0
 *       }
 *
 * @apiError Document Not Found the id of the Questions was not found.
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
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate('user')
        .populate('answer')
        .populate({
            path: 'answer',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: { path: 'user' }
        });
    
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
 * @api {post} /questions Create Question
 * @apiName PostQuestion
 * @apiGroup Question
 * 
 * 
 * @apiParam {String} text Text
 * @apiParam {String} user unique ID of the User.
 * 
 *
 * @apiSuccess {Array} answer       Array of the answer.
 * @apiSuccess {String} _id         unique ID of the Question.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Question.
 * @apiSuccess {String} updateAt    Last update date of the Question.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *   "answer": [],
 *   "_id": "5a762b939408cd11ad3cd03a",
 *   "text": "Nueva pregunta",
 *   "user": "5a76115e18d46c1518302bb1",
 *    "createdAt": "2018-02-03T21:37:23.702Z",
 *    "updatedAt": "2018-02-03T21:37:23.702Z",
 *    "__v": 0
 *}
 *
 * @apiError Document Not Found the id of the Question was not found.
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
        user: req.decoded._id
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
 * @api {put} /questions/:id Get Question id
 * @apiName GetQuestion
 * @apiGroup Question
 *
 * @apiParam {String} id Question unique ID.
 *
 * @apiSuccess {String} _id         unique ID of the Question.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Question.
 * @apiSuccess {String} updateAt    Last update date of the Question.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *    "answer": [
 *        "5a7621f97e305704a003f908",
 *        "5a76210a7e82cb032baa4483"
 *    ],
 *     "_id": "5a7620747e82cb032baa4482",
 *     "text": "Nueva pregunta",
 *     "user": "5a76115e18d46c1518302bb1",
 *     "createdAt": "2018-02-03T20:49:56.343Z",
 *     "updatedAt": "2018-02-03T21:02:31.131Z",
 *     "__v": 0
 * }
 *
 * @apiError Document Not Found the id of the Question was not found.
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
 * @api {put} /questions/:id Update Question
 * @apiName PutQuestion
 * @apiGroup Question
 *
 * @apiParam {String} id Question unique ID.
 * @apiParam {String} text Text
 * @apiParam {String} user unique ID of the User.
 *
 * @apiSuccess {String} _id         unique ID of the Question.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the User.
 * @apiSuccess {String} createdAt   Created date of the Question.
 * @apiSuccess {String} updateAt    Last update date of the Question.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *    "answer": [
 *        "5a7621f97e305704a003f908",
 *        "5a76210a7e82cb032baa4483"
 *    ],
 *     "_id": "5a7620747e82cb032baa4482",
 *     "text": "Nueva pregunta",
 *    "user": "5a76115e18d46c1518302bb1",
 *     "createdAt": "2018-02-03T20:49:56.343Z",
 *     "updatedAt": "2018-02-03T21:02:31.131Z",
 *     "__v": 0
 * }
 *
 * @apiError Document Not Found the id of the Question was not found.
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
 * @api {delete} /questions/:id Delete Question
 * @apiName DeleteQuestion
 * @apiGroup Question
 *
 * @apiParam {String} id Question unique ID.
 *
 * @apiSuccess {String} _id         unique ID of the Question.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the Users.
 * @apiSuccess {String} createdAt   Created date of the Question.
 * @apiSuccess {String} updateAt    Last update date of the Question.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *    "answer": [
 *        "5a7621f97e305704a003f908",
 *        "5a76210a7e82cb032baa4483"
 *    ],
 *     "_id": "5a7620747e82cb032baa4482",
 *     "text": "Nueva pregunta",
 *    "user": "5a76115e18d46c1518302bb1",
 *     "createdAt": "2018-02-03T20:49:56.343Z",
 *     "updatedAt": "2018-02-03T21:02:31.131Z",
 *     "__v": 0
 * }
 *
 * @apiError Document Not Found the id of the Question was not found.
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

 /**
 * @api {post} /questions/:id/answer Update Answer Question
 * @apiName PostQuestionAnswer
 * @apiGroup Question
 *
 * @apiParam {String} id Question unique ID.
 * @apiParam {String} answer Answer unique ID.
 * 
 *
 * @apiSuccess {String} _id         unique ID of the Question.
 * @apiSuccess {String} text        Text.
 * @apiSuccess {String} user        unique ID of the Users.
 * @apiSuccess {String} createdAt   Created date of the Question.
 * @apiSuccess {String} updateAt    Last update date of the Question.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *    "answer": [
 *        "5a7621f97e305704a003f908",
 *        "5a76210a7e82cb032baa4483"
 *    ],
 *     "_id": "5a7620747e82cb032baa4482",
 *     "text": "Nueva pregunta",
 *    "user": "5a76115e18d46c1518302bb1",
 *     "createdAt": "2018-02-03T20:49:56.343Z",
 *     "updatedAt": "2018-02-03T21:02:31.131Z",
 *     "__v": 0
 * }
 *
 * @apiError Document Not Found the id of the Question was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Document Not Found"
 *     }
 */
exports.addAnswers = (req, res, next) => {
    
    const answer = req.body.answer;
    
    Model.findByIdAndUpdate(req.params.id, { $push: {answer: answer} }, {new: true}, function(err, doc){
        if (err) return next(new Error(err));
        res.json(doc);
    });
};