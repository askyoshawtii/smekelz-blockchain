// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmekelzAssets {
    struct Asset {
        uint256 id;
        string name;
        string owner;
        uint256 value;
        string color;
        uint256 timestamp;
    }
    
    Asset[] public assets;
    uint256 public assetCount;
    
    event AssetCreated(uint256 indexed id, string name, string owner, uint256 value, string color);
    event AssetTransferred(uint256 indexed id, string from, string to);
    
    function createAsset(string memory _name, string memory _owner, uint256 _value, string memory _color) public {
        assetCount++;
        assets.push(Asset(assetCount, _name, _owner, _value, _color, block.timestamp));
        emit AssetCreated(assetCount, _name, _owner, _value, _color);
    }
    
    function transferAsset(uint256 _id, string memory _newOwner) public {
        require(_id > 0 && _id <= assetCount, "Asset does not exist");
        string memory previousOwner = assets[_id - 1].owner;
        assets[_id - 1].owner = _newOwner;
        emit AssetTransferred(_id, previousOwner, _newOwner);
    }
    
    function getAsset(uint256 _id) public view returns (Asset memory) {
        require(_id > 0 && _id <= assetCount, "Asset does not exist");
        return assets[_id - 1];
    }
    
    function getAllAssets() public view returns (Asset[] memory) {
        return assets;
    }
    
    function getAssetCount() public view returns (uint256) {
        return assetCount;
    }
}