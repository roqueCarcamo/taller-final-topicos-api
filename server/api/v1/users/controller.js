const jwt = require('jsonwebtoken');
const config = require('./../../../config');
const Model = require('./model');

/**
 * @api {get} /users List Users
 * @apiName GetUser
 * @apiGroup User
 * 
 * @apiParam {String} limit Limit
 * @apiParam {String} skip Skip
 *
 *
 * @apiSuccess {String} firstname   Firstname.
 * @apiSuccess {String} lastname    Lastname.
 * @apiSuccess {String} email       Email.
 * @apiSuccess {String} createdAt   Created date of the User.
 * @apiSuccess {String} updateAt    Last update date of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *   "data": [
 *        {
 *            "firstname": "Rodolfo",
 *            "lastname": "Carcamo",
 *            "email": "rodo@gmail.com",
 *            "createdAt": "2018-02-04T20:03:27.398Z",
 *            "updatedAt": "2018-02-04T20:03:27.398Z",
 *            "__v": 0
 *        }
 *   ],
 *    "limit": 10,
 *    "skip": 0,
 *    "count": 1
 *}
 *
 * @apiError Document Not Found the id of the User was not found.
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
        .limit(limit);
    
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
 * @api {post} /signup Signup
 * @apiName SignupUser
 * @apiGroup User
 *
 * @apiParam {String} firstname Firstname
 * @apiParam {String} lastname  Lastname
 * @apiParam {String} email     Email
 * @apiParam {String} password  Password
 * 
 *
 * @apiSuccess {String} firstname  Firstname.
 * @apiSuccess {String} lastname   Lastname.
 * @apiSuccess {String} email      Email.
 * @apiSuccess {String} createdAt  Created date of the Answers.
 * @apiSuccess {String} updateAt   Last update date of the Answers.
 * @apiSuccess {String} token      Token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
{
    "user": {
        "firstname": "Camila",
        "lastname": "Hernandez",
        "email": "camila@gmail.com",
        "createdAt": "2018-02-04T21:08:35.724Z",
        "updatedAt": "2018-02-04T21:08:35.724Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3NzY1MzlhOWIyODE5ZmIxMDc0OTgiLCJpYXQiOjE1MTc3Nzg1MTYsImV4cCI6MTUxNzc4MjExNn0.w2eJg8kGR_w1SE3oqSINkmbr2s0q2s-bIbN2H5fMxWE"
}
 *
 * @apiError Document Not Found the id of the Questions was not found.
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
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        password: body.password,
    });
    
    document.save()
        .then( doc => {
            const token = jwt.sign({
                    _id: doc._id
                },
                config.jwt.secret,
                {
                    algorithm: 'HS256',
                    expiresIn: '1h'
                });
            res.json({
                user: doc,
                token
            });
        })
        .catch( err => {
            next(new Error(err));
        });
};

/**
 * @api {post} /users/login Login
 * @apiName PostLogin
 * @apiGroup User
 *
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 *
 * @apiSuccess {String} firstname  Firstname
 * @apiSuccess {String} lastname   Lastname.
 * @apiSuccess {String} email      Email.
 * @apiSuccess {String} createdAt  Created date of the Answers.
 * @apiSuccess {String} updateAt   Last update date of the Answers.
 * @apiSuccess {String} token      Token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *   "user": {
 *        "firstname": "Rodolfo",
 *        "lastname": "Carcamo",
 *        "email": "rodo@gmail.com",
 *        "createdAt": "2018-02-04T20:03:27.398Z",
 *        "updatedAt": "2018-02-04T20:03:27.398Z",
 *        "__v": 0
 *    },
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTc3NjcwZjJiZGU4ZTEyMDMwY2NhN2MiLCJpYXQiOjE1MTc3NzU0NjMsImV4cCI6MTUxNzc3OTA2M30.JdNH2g8DzOkW1dvG9E5xfaobAbQ9GeVDERDV0bYISbw"
 *}
 *
 * @apiError Document Not Found the id of the Questions was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Document Not Found"
 *     }
 */
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    Model.findOne({ email: email })
        .then(doc => {
            if(doc){
                // Compare Password
                doc.comparePassword(password, (err, match) => {
                    if (err) {
                        next(new Error(err));
                    } else {
                        if (match) {
                            const token = jwt.sign({
                                    _id: doc._id
                                },
                                config.jwt.secret,
                                {
                                    algorithm: 'HS256',
                                    expiresIn: '1h'
                                });
                            res.json({
                                user: doc,
                                token
                            });
                        } else {
                            res.status(401).json({
                                message: "Unauthorized"
                            });
                        }
                    }
                });
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

exports.profile = (req, res, next) => {
    Model.findById(req.decoded._id)
        .then( doc => {
            if(doc){
               res.json(doc);
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
