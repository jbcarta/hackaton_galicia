const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const nodeAddr = 'JohnLetterApproach';
 
const Blockchain = require('src/blockchain');
const bitcoin = new Blockchain();

app.get('/', function (req, res) {
     res.json('Welcome test mining block!');
});
 
 
app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});
 
app.post('/transaction', function (req, res) {
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
 
app.get('/mine', function (req, res) {
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