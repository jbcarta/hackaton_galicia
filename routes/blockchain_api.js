var express = require('express');
var path = require('path');
var router = express.Router();

//const express = require("express");
//var router = express.Router();
//var path = require('path');

const bodyParser = require("body-parser");

const nodeAddr = 'JohnLetterApproach';

var url = require("url");
 
const Blockchain = require('../public/js/blockchain');


/*
router.get('/', function (req, res) {
     res.json('Welcome test mining block!');
});
 
 */


router.get('/genesys', function (req, res) 
{
    console.log("---------------------------------------------");
    console.log("get /Blockchain...");
    
    const bitcoin = new Blockchain();
    
});



router.get('/blockchain', function (req, res) {
  console.log("---------------------------------------------");    
  console.log("get /Blockchain...");
    res.send(bitcoin);
});
 
router.post('/transaction', function (req, res) {
    const blockIndex = bitcoin.makeNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
 
    res.json(
        {
            message: `Transaction is added to block with index: ${blockIndex}`
        }
    );
});
 
router.get('/mine', function (req, res) {
    const latestBlock = bitcoin.getLatestBlock();
    const prevBlockHash = latestBlock.hash;
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: latestBlock.index + 1
    }
    const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);
 
    // reward for mining
    bitcoin.makeNewTransaction(1, '00000', nodeAddr);
 
    const newBlock = bitcoin.creatNewBlock(nonce, prevBlockHash, blockHash)
    res.json(
        {
            message: 'Mining new Block successfully!',
            newBlock
        }
    );
});

/*
 
app.listen(3000, function () {
    console.log('> listening on port 3000...');
});
*/