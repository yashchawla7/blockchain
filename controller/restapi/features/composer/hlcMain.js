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
const fs = require('fs');
const path = require('path');
const _home = require('os').homedir();
const hlc_idCard = require('composer-common').IdCard;
const composerAdmin = require('composer-admin');
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const config = require('../../../env.json');
const NS = 'org.acme.Z2BTestNetwork';

exports.updateState = function(req, res, next){
    let businessNetworkConnection;
    let factory;
    businessNetworkConnection = new BusinessNetworkConnection();
    // connection prior to V0.15
    // return businessNetworkConnection.connect(config.composer.connectionProfile, config.composer.network, config.composer.adminID, config.composer.adminPW)
    // connection in v0.15
    return businessNetworkConnection.connect(config.composer.adminCard)
        .then(() => {
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            return businessNetworkConnection.getParticipantRegistry(NS + '.User')
                .then(function (participantRegistry) {
                    let ts = Date.now();

                    return participantRegistry.get(req.body.userId)
                    .then((participant) => {
                        //console.log("[Before]")
                        //console.log(participant)
                        participant.state = req.body.state;
                        //console.log("[After]")
                        //console.log(participant)
                        participantRegistry.update(participant)
                        .then(() => {console.log(participant.name+' successfully updated.'); res.send({ 'result': 'Successfully updated.', 'success': true});})
                        .catch((error) => {console.log(participant.name+' update failed.', error); res.send({ 'result': error, 'success':false});});
                    })
                    .catch((_res) => {
                        res.send('member do not exists. update cancle');
                    });
                })
                .catch((error) => { console.log('error with getParticipantRegistry', error); res.send(error); });
        })
        .catch((error) => { console.log('error with businessNetworkConnection', error); res.send(error); });

}

exports.addUser = function (req, res, next) {
    let businessNetworkConnection;
    let factory;
    businessNetworkConnection = new BusinessNetworkConnection();
    // connection prior to V0.15
    // return businessNetworkConnection.connect(config.composer.connectionProfile, config.composer.network, config.composer.adminID, config.composer.adminPW)
    // connection in v0.15
    return businessNetworkConnection.connect(config.composer.adminCard)
        .then(() => {
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            return businessNetworkConnection.getParticipantRegistry(NS + '.User')
                .then(function (participantRegistry) {
                    let ts = Date.now();

                    return participantRegistry.get(ts.toString())
                    .then((_res) => { res.send('member already exists. add cancelled');})
                    .catch((_res) => {
                        console.log(ts.toString() +' not in User registry. ');
                        let participant = factory.newResource(NS, 'User', ts.toString());
                        participant.userId = ts.toString();
                        participant.name = req.body.name;
                        participant.email = req.body.email;
                        participant.phoneNumber = req.body.phoneNumber;
                        participant.aadharNumber = req.body.aadharNumber;
                        participant.IPFile = req.body.IPFile;
                        participant.state = 'CREATED';
                        participantRegistry.add(participant)
                        .then(() => {console.log(req.body.name+' successfully added'); res.send({ 'result': 'Successfully saved.', 'success': true});})
                        .catch((error) => {console.log(req.body.name+' add failed', error); res.send({ 'result': error, 'success':false});});
                    });
                })
                .catch((error) => { console.log('error with getParticipantRegistry', error); res.send(error); });
        })
        .catch((error) => { console.log('error with businessNetworkConnection', error); res.send(error); });
};


exports.getAllUser = function (req, res, next) {
    let businessNetworkConnection;
    let factory;
    let allUser = new Array();
    businessNetworkConnection = new BusinessNetworkConnection();
    // connection prior to V0.15
    // return businessNetworkConnection.connect(config.composer.connectionProfile, config.composer.network, config.composer.adminID, config.composer.adminPW)
    // connection in v0.15

    let serializer;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename), 'network', 'dist', 'zerotoblockchain-network.bna'));
    return BusinessNetworkDefinition.fromArchive(archiveFile)
        .then((bnd) => {
            serializer = bnd.getSerializer();

            return businessNetworkConnection.connect(config.composer.adminCard)
                .then(() => {
                    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
                    return businessNetworkConnection.getParticipantRegistry(NS + '.User')
                        .then(function (participantRegistry) {

                            return participantRegistry.getAll()
                                .then((members) => {
                                    //console.log('There are ' + members.length + ' entries.');

                                    for (let each in members) {
                                        (function (_idx, _arr) {
                                            let _jsn = serializer.toJSON(_arr[_idx]);
                                            //console.log(_idx, _jsn)
                                            let participant = {}
                                            participant.userId = _jsn.userId;
                                            participant.name = _jsn.name;
                                            participant.email = _jsn.email;
                                            participant.phoneNumber = _jsn.phoneNumber;
                                            participant.aadharNumber = _jsn.aadharNumber;
                                            participant.IPFile = _jsn.IPFile;
                                            participant.state = _jsn.state;
                                            //console.log("Participant", participant)
                                            allUser.push(participant);
                                        })(each, members)
                                    }

                                    res.send({ 'result': 'success', 'success': true, 'user': allUser });
                                })
                                .catch((_res) => {
                                    console.log('No one registered', _res);
                                });
                        })
                        .catch((error) => { console.log('error with getParticipantRegistry', error); res.send(error); });
                })
                .catch((error) => { console.log('error with businessNetworkConnection', error); res.send(error); });
        })


};


exports.uploadFiles = async (req, res, next) => {

    res.status(200).json({
        message: 'File uploaded Successful!',
        request: req.file,
        status: true
    });
}