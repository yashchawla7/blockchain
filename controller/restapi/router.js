/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use strict';

let express = require('express');
let router = express.Router();
let format = require('date-format');
let multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname )
    }
});
//+ path.extname(file.originalname)
var upload = multer({ storage : storage});

let hlcMain = require('./features/composer/hlcMain');


module.exports = router;
let count = 0;
/**
 * This is a request tracking function which logs to the terminal window each request coming in to the web serve and 
 * increments a counter to allow the requests to be sequenced.
 * @param {express.req} req - the inbound request object from the client
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * 
 * @function
 */
router.use(function(req, res, next) {
  count++;
  console.log('['+count+'] at: '+format.asString('hh:mm:ss.SSS', new Date())+' Url is: ' + req.url);
  next(); // make sure we go to the next routes and don't stop here
});


router.post('/composer/admin/addUser*', hlcMain.addUser);
router.post('/composer/admin/updateState*', hlcMain.updateState);
router.get('/composer/admin/getAllUser*', hlcMain.getAllUser);
router.post('/api/blockchain/upload*', upload.single('userPhoto'), hlcMain.uploadFiles);


