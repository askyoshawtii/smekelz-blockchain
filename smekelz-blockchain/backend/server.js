const express = require('express');
const Web3 = require('web3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to FREE Ganache blockchain
const web3 = new Web3('http://localhost:8545');

// Simple in-memory blockchain (for ultra-lightweight testing)
class SimpleBlockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        this.chain.push({
            index: 0,
            timestamp: Date.now(),
            transactions: [],
            previousHash: '0',
            hash: this.calculateHash(0, Date.now(), [], '0')
        });
    }

    createTransaction(asset) {
        this.pendingTransactions.push({
            ...asset,
            timestamp: Date.now(),
            txHash: Math.random().toString(36).substring(7)
        });
    }

    mineBlock() {
        const block = {
            index: this.chain.length,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            previousHash: this.chain[this.chain.length - 1].hash,
        };
        
        block.hash = this.calculateHash(block.index, block.timestamp, block.transactions, block.previousHash);
        this.chain.push(block);
        this.pendingTransactions = [];
        
        return block;
    }

    calculateHash(index, timestamp, transactions, previousHash) {
        return Web3.utils.sha3(index + timestamp + JSON.stringify(transactions) + previousHash);
    }

    getChain() {
        return this.chain;
    }

    getAssets() {
        return this.chain.flatMap(block => block.transactions);
    }
}

// Initialize blockchain
const smekelzChain = new SimpleBlockchain();

// API Routes
app.get('/api/blockchain', (req, res) => {
    res.json({
        blocks: smekelzChain.chain.length,
        chain: smekelzChain.getChain()
    });
});

app.get('/api/assets', (req, res) => {
    res.json(smekelzChain.getAssets());
});

app.post('/api/assets', (req, res) => {
    const { id, owner, value, color } = req.body;
    
    smekelzChain.createTransaction({
        id,
        owner,
        value,
        color,
        type: 'CREATE_ASSET'
    });
    
    // Mine a new block every 3 transactions
    if (smekelzChain.pendingTransactions.length >= 3) {
        smekelzChain.mineBlock();
    }
    
    res.json({ success: true, message: 'Asset created' });
});

app.post('/api/mine', (req, res) => {
    const newBlock = smekelzChain.mineBlock();
    res.json({ success: true, block: newBlock });
});

app.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        res.json(accounts);
    } catch (error) {
        // Fallback to mock accounts
        res.json(['0x742E...A1b2', '0x8a3F...C4d5', '0x1f5E...E6f7']);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Smekelz Blockchain API running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/blockchain`);
});