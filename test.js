const fs = require("fs");
const solc = require('solc')
let Web3 = require('web3');
let web3;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

//编译合约
//以下编译方法已经过期了
//let source = "pragma solidity ^0.4.0;contract Calc{  /*区块链存储*/  uint count;  /*执行会写入数据，所以需要`transaction`的方式执行。*/  function add(uint a, uint b) returns(uint){    count++;    return a + b;  }  /*执行不会写入数据，所以允许`call`的方式执行。*/  function getCount() constant returns (uint){    return count;  }}";
//let calcCompiled = web3.eth.compile.solidity(source);
//改用solc编译，需要先 npm install -g solc
const input = fs.readFileSync('calc.sol');
const output = solc.compile(input.toString(),1);
var bytecode;
var abi;
for (var contractName in output.contracts) {
	// code and ABI that are needed by web3
	bytecode = output.contracts[contractName].bytecode
	abi = JSON.parse(output.contracts[contractName].interface)
	//console.log(contractName + ': ' + output.contracts[contractName].bytecode)
	//console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface))
	//console.log(JSON.stringify(abi, undefined, 2));
	//可以把abi打印出来，看看智能合约的编译和本来的是不是相同
}

//获取合约实例
const contract = new web3.eth.Contract(abi)

//部署合约
var contract_adderss;
contract.deploy({
    data: bytecode
}).send({
  from:'0xe9da1d92fa6b282f4d8d80a58f1518f0234de2eb',//这个地址就是我们刚刚在testrpc里unlock的第一个节点的地址
  gas: 4712388,
  gasPrice: '10000000000000',
})
.then((instance) => {
	contract_adderss = instance.options.address;
  	console.log(`Address: ${contract_adderss}`);
});