#!/bin/bash

# Free Blockchain Setup Script
echo "🚀 Setting up FREE Smekelz Blockchain..."

# 1. Install prerequisites
sudo apt update
sudo apt install -y docker.io docker-compose nodejs npm git

# 2. Clone Fabric samples
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples

# 3. Install Fabric binaries
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.0 1.5.7

# 4. Add to PATH
export PATH=$PATH:$(pwd)/bin
echo 'export PATH=$PATH:'$(pwd)/bin >> ~/.bashrc

# 5. Start test network
cd test-network
./network.sh up createChannel -c smekelzchannel

# 6. Deploy chaincode
./network.sh deployCC -ccn smekelz -ccp ../../chaincode -ccl go

echo "✅ FREE Blockchain setup complete!"