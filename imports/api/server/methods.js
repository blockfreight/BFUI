import ipfsAPI from "ipfs-api";
import buffer from "buffer/"
import { sha256, sha224 } from 'js-sha256';
const chp = require('chainpoint-client')
import {BillOfLading} from "../../lib/collections";
import {Meteor} from "meteor/meteor";


Meteor.publish('BillOfLading', () => {

    return BillOfLading.find({},{sort:{Name:1}});
});

function r(hash)
{
    runIt(hash)
}
async function runIt (hash) {
    // A few sample SHA-256 proofs to anchor
    let hashes = [sha256(hash)]//'1d2a9e92b561440e8d27a21eed114f7018105db00262af7d7087f7dea9986b0a']

    // Submit each hash to three randomly selected Nodes
    let proofHandles = await chp.submitHashes(hashes)
    console.log("Submitted Proof Objects: Expand objects below to inspect.")
    console.log(proofHandles)

    // Wait for Calendar proofs to be available
    console.log("Sleeping 12 seconds to wait for proofs to generate...")
   // await new Promise(resolve => setTimeout(resolve, 12000))

    // Retrieve a Calendar proof for each hash that was submitted
    let proofs = await chp.getProofs(proofHandles)
    console.log("Proof Objects: Expand objects below to inspect.")
    console.log(proofs)
    BillOfLading.insert({date:new Date(),userId:Meteor.userId(),IPFS:hash, proof:proofs})
    //await new Promise(resolve => setTimeout(resolve, 12000))
    // Verify every anchor in every Calendar proof
    let verifiedProofs = await chp.verifyProofs(proofs)
    console.log("Verified Proof Objects: Expand objects below to inspect.")
    console.log(verifiedProofs)
}

function Sign(res)
{
    console.log(res);
}
function Broadcast(res)
{

}
Meteor.methods({
    sendVerificationLink() {
        let userId = Meteor.userId();
        if ( userId ) {
            return Accounts.sendVerificationEmail( userId );
        }
    },
    AddBOL(bol)
    {


        let fql ="{\n" +
            '{query:mutation {tx: constructBFTX(Properties:{ Shipper:"VLX454323F" BolNum:"15455", NumBol:"15555", RefNum:"154532165", Consignee:"teste", Vessel:"132153456", PortOfLoading:"21514", PortOfDischarge:"51651", NotifyAddress:"89-91 City Rd, Southbank 3006, VIC, Australia", DescOfGoods:"This is the goods description.", GrossWeight:"15523", FreightPayableAmt:"354534", FreightAdvAmt:"35448552", GeneralInstructions:"There are many general instructions.", DateShipped:"20161128", IssueDetails:{ PlaceOfIssue: "Place 1", DateOfIssue: "20171228" }, MasterInfo: { FirstName: "First name masterinfo", LastName: "last name masterinfo", Sig: "teste" }, AgentForMaster: { FirstName: "First name masterinfo", LastName: "last name masterinfo", Sig: "teste" }, AgentForOwner: { FirstName: "First name masterinfo", LastName: "last name masterinfo", Sig: "teste", ConditionsForCarriage: "blablabsla" } }){Id}}}';


        query =
             "mutation {tx: constructBFTX(Properties:{ Shipper:\"VLX454323F\" BolNum:\"15455\", NumBol:\"15555\", RefNum:\"154532165\", Consignee:\"teste\", Vessel:\"132153456\", PortOfLoading:\"21514\", PortOfDischarge:\"51651\", NotifyAddress:\"89-91 City Rd, Southbank 3006, VIC, Australia\", DescOfGoods:\"This is the goods description.\", GrossWeight:\"15523\", FreightPayableAmt:\"354534\", FreightAdvAmt:\"35448552\", GeneralInstructions:\"There are many general instructions.\", DateShipped:\"20161128\", IssueDetails:{ PlaceOfIssue: \"Place 1\", DateOfIssue: \"20171228\" }, MasterInfo: { FirstName: \"First name masterinfo\", LastName: \"last name masterinfo\", Sig: \"teste\" }, AgentForMaster: { FirstName: \"First name masterinfo\", LastName: \"last name masterinfo\", Sig: \"teste\" }, AgentForOwner: { FirstName: \"First name masterinfo\", LastName: \"last name masterinfo\", Sig: \"teste\", ConditionsForCarriage: \"blablabsla\" } }){Id}}"
        query = `mutation constructBFTX(Properties:{ Shipper:"VLX454323F", 
               BolNum:"15455", NumBol:"15555", RefNum:"154532165", Consignee:"teste", Vessel:"132153456", 
               PortOfLoading:"21514", PortOfDischarge:"51651", NotifyAddress:"89-91 City Rd, Southbank 3006, VIC, Australia", 
               DescOfGoods:"This is the goods description.", GrossWeight:"15523", FreightPayableAmt:"354534", 
               FreightAdvAmt:"35448552", GeneralInstructions:"There are many general instructions.", 
               DateShipped:"20161128", IssueDetails:{ PlaceOfIssue: "Place 1", DateOfIssue: "20171228" }, 
               MasterInfo: { FirstName: "First name masterinfo", LastName: "last name masterinfo", Sig: "teste" }, 
               AgentForMaster: { FirstName: "First name masterinfo", LastName: "last name masterinfo", Sig: "teste" }, 
               AgentForOwner: { FirstName: "First name masterinfo", LastName: "last name masterinfo", Sig: "teste", 
                 ConditionsForCarriage: "blablabsla" } }){Id}`.replace(/(\r\n\t|\n|\r\t)/gm,"");
        const headers = {
           // "Authorization": `Basic ${(new Buffer(`${username}@${company}:${password}`).toString('base64'))}`,
            "Content-Type": "application/json",
            "accept":"application/json",
        };
        //query = "mutation {tx: constructBFTX(" + JSON.stringify(JSON.parse(Assets.getText("templates/transaction_for_graphql.json"))).substr(1).slice(0, -1); + "){Id}"
        // JSON.stringify({query:query})
        HTTP.post(`http://localhost:12345/bftx-api`, JSON.stringify({query:"'" + query + "'"}), (err,res)=>{
            err ? console.log(err) : Sign(res);
        });
       // var ipfsAPI = require('ipfs-api')

// connect to ipfs daemon API server
        var ipfsNode = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}) // leaving out the arguments will default to these values
        var Base58 = require('base-58');
        var s = Base58.encode(new buffer.Buffer("tests"))
        const Buffer = ipfsAPI().Buffer
        var b = Buffer(Assets.getText("templates/transaction.json"))
        var upload = {
            "path": "attribute.txt",
            "content": b
        }
///var b = new buffer.Buffer("test");
        ipfsNode.add(upload, Meteor.bindEnvironment(function(err, res){
            if (err || !res){
                console.log("Did not add the IPFS file.", err);
            }
            else {
                console.log(res)
               // Meteor.bindEnvironment((res, cb) => {

                 //   return cb
                //})

                // { path: 'attribute.json',
                // I20180330-15:05:51.798(-7)?     hash: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
                // I20180330-15:05:51.798(-7)?     size: 4 }
                // res.forEach(function(file){
                //     addAttributeToEthRegistry(file.hash, payloadHash, type, cb);
                // });
                //const chp = require('chainpoint-client')
                r(res[0].hash);
              //  return cb
            }
        }));
    //     ipfs.files.add(bol,(err, result) => {
    //     if (err) {
    //         throw err
    //     }
    //     console.log(result)
    // })

    },
    GetTransaction(id){

    },
    Login(user,pass){

    },
    ListCards()
    {

    },

    RegisterEdgeToken(edgeAccount) {

       // Accounts.createUser();
        const stampedLoginToken = LoginLinks.generateAccessToken(Meteor.user());
        let user = Meteor.user()
        user.services.edge = {
            id: edgeAccount.id, // Edge ID
            authorizationToken:stampedLoginToken

        }
        Meteor.users.update({_id:Meteor.userId()},user)
        return user.services.edge
    },
    VerifyEmail(email){
       // this.unblock();
        if(Meteor.user().emails)
        {
            Accounts.removeEmail(Meteor.userId(),Meteor.user().emails["0"].address)
        }

        Accounts.addEmail(Meteor.userId(), email);
        Accounts.sendVerificationEmail(Meteor.userId(), email);
    },
    GetEdgeToken(edgeId)
    {
        let user = Meteor.users.findOne({"services.edge.id":edgeId});


        if(!user)
        {
            throw new Meteor.Error('REGISTER_USER', "User not found");
        }
        if(!user.emails[0].verified)
        {
            throw new Meteor.Error('REGISTER_USER', "Email not found or not validated");
        }
        return user.services.edge;
    },
    SetEdgeToken(account)
    {

        Accounts.createUser({username, email, password}, () => {
            Meteor.loginWithPassword(email, password, () => {
                FlowRouter.go('/home');
            });
        });
    },
    LinkEdge(id){
        const stampedLoginToken = LoginLinks.generateAccessToken(Meteor.user());
        let user = Meteor.user()
        user.services.edge = {
            id: id, // Edge ID
            authorizationToken:stampedLoginToken

        }
        Meteor.users.update({_id:Meteor.userId()},user)
    },
    AddCard(card){
        //https://stripe.com/docs/saving-cards
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        var stripe = require("stripe")(process.env.ENV_STRIPE);
        stripe.customers.create({
            description: 'John Doe',
            source: "tok_mastercard" // obtained with Stripe.js
        }, function(err, customer) {
            if(err){
                console.log(err)
            }else {
                console.log(customer)
            }
            // asynchronously called
        });
        // (async function() {
        //     // Create a Customer:
        //     const customer = await stripe.customers.create({
        //         source: 'tok_mastercard',
        //         email: 'paying.user@example.com',
        //     });
        //
        //     // Charge the Customer instead of the card:
        //     const charge = await stripe.charges.create({
        //         amount: 1000,
        //         currency: 'usd',
        //         customer: 'CUSTOMER',
        //     });
        //
        //     //  Save the customer ID and other info in a database for later need here.
        //
        // })();
        //
        // (async function() {
        //     // When it's time to charge the customer again, retrieve the customer ID.
        //     const charge = stripe.charges.create({
        //         amount: 1500, // $15.00 this time
        //         currency: 'usd',
        //         customer: 'CUSTOMER', // Previously stored, then retrieved
        //     });
        // })();
    }
})

SimpleRest.setMethodOptions('publickey', {
    url: '/api/publickey',
    getArgsFromRequest: function (request) {
        const { headers } = request;

        const data = {};
        try{
            // const readableState = request._readableState;
            // const  buffer = readableState.buffer[0];
            // const json = JSON.parse(buffer.toString('utf8'));
        }catch(err){
            console.log(err)
        }

        return [ headers, data ]
    },
    httpMethod: "get"
});
Meteor.methods({
    publickey(headers, data) {
        const metaData = {
            type: 'GET',
            path: '/api/publickey',
            request: {
                headers,
                data
            }
        };

       //add code that takes an existing private key and creates a new public key every request



        return {result: '-----BEGIN PUBLIC KEY-----\n' +
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0\n' +
            'FPqri0cb2JZfXJ/DgYSF6vUpwmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/\n' +
            '3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQAB\n' +
            '-----END PUBLIC KEY-----'};
    },
    purchaseorder(headers, data) {
        const metaData = {
            type: 'POST',
            path: '/api/purchaseorder',
            request: {
                headers,
                data
            }
        };



        return {result: 'OK'};
    }
    ,
    invoice(headers, data) {
        const metaData = {
            type: 'POST',
            path: '/api/invoice',
            request: {
                headers,
                data
            }
        };




        return {result: 'OK'};
    },
    BillOfLading(headers, data) {
        const metaData = {
            type: 'POST',
            path: '/api/billoflading',
            request: {
                headers,
                data
            }
        };



        return {result: 'OK'};
    }

});