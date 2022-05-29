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
                gestionnaireID: "6b0e036c-1acf-4189-ac93-0bfa4b23a970",
                leadID: "1632729b-3382-47df-9f65-ff6a87f52e44",
                app_AffID: "34a81384-c9c7-4b31-8dda-46019c641440",
                comm_app_aff: "20",
                type: "Achat bien immobilier",
                montant: "1000",
                region: "liege",
                commentaire: "NON",
                valide: "false",
                Retirer: "true",
                payer: "true",
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
    async createContract(ctx, gestionnaireID, leadID, app_AffID, comm_app_aff, type, montant, region, commentaire, valide, Retirer, payer) {
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

        }


        //Create new index
        newID = allResults.length + 1
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
            Retirer,
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
    async queryAllValidContractByAppAff(ctx, appAffId) {
        const startKey = '';
        const endKey = '';
        const allResults = []
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

            if (record["app_AffID"] == appAffId && record["valide"] == "true") {
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
        contrat.Retirer = "true";

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
        contrat.Retirer = "false";

        await ctx.stub.putState(contractNumber, Buffer.from(JSON.stringify(contrat)));
        console.info('============= END : setContractAsRedeemed ===========');
    }


    //Mark specified contract as paid by the admin
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

    //Mark set specified contract as not paid
    async setContractAsUnpaid(ctx, contractNumber) {
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


}

module.exports = FabCar;
