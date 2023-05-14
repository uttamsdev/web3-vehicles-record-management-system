//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract VehicleRecordManagementSystem {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }

    struct Vehicle {
        string ownerName;
        string ownerNumber;
        string ownerAddress;
        string model;
        string soldDate;
    }

    modifier onlyOwner(){
        require(msg.sender==owner, "You are not owner");
        _;
    }

    Vehicle[] private vehicles;

    function addVehicle(string memory _ownerName, string memory _ownerNumber, string memory _ownerAddress, string memory _model, string memory _soldDate) public onlyOwner{
        vehicles.push(
            Vehicle(_ownerName, _ownerNumber, _ownerAddress, _model, _soldDate)
        );
    }

    function getVehicles() public view returns(Vehicle[] memory){
        return vehicles;
    }

}