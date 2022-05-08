/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {
    Contract
} = require('fabric-contract-api');

class FabCar extends Contract {

    // Initiate the ledger with dumb data
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const contrats = [{
                gestionnaireID: '54893254',
                leadID: '11452714',
                app_AffID: '96566351',
                comm_app_aff: '250.00',
                type: 'Assur-vie',
                montant: '1750.00',
                region: 'Liege',
                commentaire: 'Validé: 01/03/2022',
                valide: 'true',
                retirer: 'false',
                payer: 'false',
            },
            {
                gestionnaireID: '54893254',
                leadID: '80065934 ',
                app_AffID: '96566351',
                comm_app_aff: '310.00',
                type: 'Assur-vie',
                montant: '1750.00',
                region: 'Liege',
                commentaire: 'Validé: 05/03/2022',
                valide: 'true',
                retirer: 'true',
                payer: 'false',
            },

            {
                gestionnaireID: '54893254',
                leadID: '23830188  ',
                app_AffID: '96566351',
                comm_app_aff: '310.00',
                type: 'Assur-vie',
                montant: '1750.00',
                region: 'Liege',
                commentaire: 'Validé: 6666/03/2022',
                valide: 'false',
                retirer: 'false',
                payer: 'false',
            },

            {
                gestionnaireID: '54893254',
                leadID: '81095403  ',
                app_AffID: '96566351',
                comm_app_aff: '310.00',
                type: 'Assur-vie',
                montant: '1750.00',
                region: 'Liege',
                commentaire: 'Validé: 08/03/2022',
                valide: 'false',
                retirer: 'true ',
                payer: 'false',
            },

            {
                gestionnaireID: '54893254',
                leadID: '70757659  ',
                app_AffID: '96566351',
                comm_app_aff: '310.00',
                type: 'Assur-vie',
                montant: '1750.00',
                region: 'Liege',
                commentaire: 'Validé: 91/03/2022',
                valide: 'true',
                retirer: 'false',
                payer: 'false',
            },

            {
                gestionnaireID: '38069735 ',
                leadID: '41575471 ',
                app_AffID: '23941021 ',
                comm_app_aff: '400.00',
                type: 'Renovation Ch-1',
                montant: '8750.00',
                region: 'Namur',
                commentaire: 'Pas dispo > vacances',
                valide: 'true',
                retirer: 'false',
                payer: 'true',
            },


        ];

        for (let i = 0; i < contrats.length; i++) {
            contrats[i].docType = 'contrat';
            await ctx.stub.putState(i.toString(), Buffer.from(JSON.stringify(contrats[i])));
            console.info('Added <--> ', contrats[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }




    // Get One specific contract by contract number
    async queryContract(ctx, contractNumber) {
        const carAsBytes = await ctx.stub.getState(contractNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${contractNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    // Create new contract
    async createContract(ctx, gestionnaireID, leadID, app_AffID, comm_app_aff, type, montant, region, commentaire, valide, retirer, payer) {
        //Querry contracts to find last contract ID
        const startKey = '';
        const endKey = '';
        const allResults = [];
        let newID = 0;
        for await (const {
            key,
            value
        } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({
                Key: key,
                Record: record
            });
            //Create new index
            newID = parseInt(key) + 1
        }
        //console.info(allResults);
        //console.info("NewID= "+ newID);


        console.info('============= START : Create Contract ===========');

        const contrat = {
            docType: 'contrat',
            gestionnaireID,
            leadID,
            app_AffID,
            comm_app_aff,
            type,
            montant,
            region,
            commentaire,
            valide,
            retirer,
            payer,
        };

        await ctx.stub.putState(newID.toString(), Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : Create Contract ===========');
    }

    // Retreive all contracts
    async queryAllContracts(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {
            key,
            value
        } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({
                Key: key,
                Record: record
            });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


    // Retreive all valids and non redeemed contracts for specified App/Aff
    async queryAllValidNonRedeemedContractByAppAff(ctx, appAffId) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {
            key,
            value
        } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            if (record["app_AffID"] == appAffId && record["valide"] == "true" && record["retirer"] == "false") {
                allResults.push({
                    Key: key,
                    Record: record
                });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    // Retreive all contracts for specified App/Aff
    async queryAllContractByAppAff(ctx, appAffId) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {
            key,
            value
        } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            if (record["app_AffID"] == appAffId) {
                allResults.push({
                    Key: key,
                    Record: record
                });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


    // Retreive contract by lead ID
    async queryAllContractByLead(ctx, leadId) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {
            key,
            value
        } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            if (record["leadID"] == leadId) {
                allResults.push({
                    Key: key,
                    Record: record
                });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }



    // Retreive contract by gestionnaire
    async queryAllContractByGestionnaire(ctx, gestionnaireId) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {
            key,
            value
        } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            if (record["gestionnaireID"] == gestionnaireId) {
                allResults.push({
                    Key: key,
                    Record: record
                });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


    //Set specified contract to valid
    async validateContract(ctx, contractNumber) {
        console.info('============= START : validateContract ===========');

        const contratAsBytes = await ctx.stub.getState(contractNumber); // get the contract from chaincode state
        if (!contratAsBytes || contratAsBytes.length === 0) {
            throw new Error(`${contractNumber} does not exist`);
        }
        const contrat = JSON.parse(contratAsBytes.toString());
        contrat.valide = "true";

        await ctx.stub.putState(contractNumber, Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : validateContract ===========');
    }


    //Set specified contract to invalid
    async disableContract(ctx, contractNumber) {
        console.info('============= START : disableContract ===========');

        const contratAsBytes = await ctx.stub.getState(contractNumber); // get the contract from chaincode state
        if (!contratAsBytes || contratAsBytes.length === 0) {
            throw new Error(`${contractNumber} does not exist`);
        }
        const contrat = JSON.parse(contratAsBytes.toString());
        contrat.valide = "false";

        await ctx.stub.putState(contractNumber, Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : disableContract ===========');
    }


    //Mark specified contract as redeemed so it doens't appear in the App/aff list anymore
    async setContractAsRedeemed(ctx, contractNumber) {
        console.info('============= START : setContractAsRedeemed ===========');

        const contratAsBytes = await ctx.stub.getState(contractNumber); // get the contract from chaincode state
        if (!contratAsBytes || contratAsBytes.length === 0) {
            throw new Error(`${contractNumber} does not exist`);
        }
        const contrat = JSON.parse(contratAsBytes.toString());
        contrat.retirer = "true";

        await ctx.stub.putState(contractNumber, Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : setContractAsRedeemed ===========');
    }


    //Mark specified contract as still reedemable so it does appear in the App/aff list
    async setContractAsRedeemable(ctx, contractNumber) {
        console.info('============= START : setContractAsRedeemed ===========');

        const contratAsBytes = await ctx.stub.getState(contractNumber); // get the contract from chaincode state
        if (!contratAsBytes || contratAsBytes.length === 0) {
            throw new Error(`${contractNumber} does not exist`);
        }
        const contrat = JSON.parse(contratAsBytes.toString());
        contrat.retirer = "false";

        await ctx.stub.putState(contractNumber, Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : setContractAsRedeemed ===========');
    }


    //Mark specified contract as as paid 
    async setContractAsPaid(ctx, contractNumber) {
        console.info('============= START : setContractAsRedeemed ===========');

        const contratAsBytes = await ctx.stub.getState(contractNumber); // get the contract from chaincode state
        if (!contratAsBytes || contratAsBytes.length === 0) {
            throw new Error(`${contractNumber} does not exist`);
        }
        const contrat = JSON.parse(contratAsBytes.toString());
        contrat.payer = "true";

        await ctx.stub.putState(contractNumber, Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : setContractAsRedeemed ===========');
    }

    //Mark specified contract as as unpaid
    async setContractAsUnpaid(ctx, contractNumber) {
        console.info('============= START : setContractAsRedeemed ===========');

        const contratAsBytes = await ctx.stub.getState(contractNumber); // get the contract from chaincode state
        if (!contratAsBytes || contratAsBytes.length === 0) {
            throw new Error(`${contractNumber} does not exist`);
        }
        const contrat = JSON.parse(contratAsBytes.toString());
        contrat.payer = "false";

        await ctx.stub.putState(contractNumber, Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : setContractAsRedeemed ===========');
    }


    // Retreive contract by lead ID
    async queryAllContractByLead(ctx, leadId) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {
            key,
            value
        } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            if (record["leadID"] == leadId) {
                allResults.push({
                    Key: key,
                    Record: record
                });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


}

module.exports = FabCar;
