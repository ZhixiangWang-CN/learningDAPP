//--------为了拿到智能合约的abi，重新编译一遍。你也可以之前先保存abi，再直接传进去。这部分代码跟之前是一样的-------//
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
const input = fs.readFileSync('calc.sol');
const output = solc.compile(input.toString(),1);
var bytecode;
var abi;
for (var contractName in output.contracts) {
	// code and ABI that are needed by web3
	bytecode = output.contracts[contractName].bytecode
	abi = JSON.parse(output.contracts[contractName].interface)
}
//--------为了拿到智能合约的abi，重新编译一遍。你也可以之前先保存abi，再直接传进去。这部分代码跟之前是一样的-------//


// 获得智能合约的实例
var contractInstance = new web3.eth.Contract(abi, '0xdD0d07399cf3cdA1df21a5159E0A2B47BF8706b5');//第二个参数是合约地址，这个地址之前发布合约的时候已经生成了，直接粘进来就行
//把网页的html代码传进来
const fs1 = require("fs");
const index_html = fs1.readFileSync('index.html').toString();

//首页
function index (response, data) {
    var body = index_html;
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write('<head><meta charset="utf-8"/></head>');
    response.write(body);
    response.end(); 
}
//调用智能合约进行加法计算的次数
function count (response, data) {
	var count = "inital"
	// Call the getcount function
    contractInstance.methods.getCount().call().then(function(result){
		console.log(result)
		count = result
		var body = '总共被调用'+count+'次'
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write('<head><meta charset="utf-8"/></head>');
    	response.write(body);
    	response.end();   
	});
     
}
//计算结果页
function result (response,data){

	// using the promise
	var dest_account = '0xe9da1d92fa6b282f4d8d80a58f1518f0234de2eb'//用第一个unlock的账户地址来发送交易
	
	var addresult = contractInstance.methods.add(parseFloat(data['add1']),parseFloat(data['add2'])).send({from: dest_account}).then(function(re){

	contractInstance.methods.getEquation().call().then(function(resultw){
	
	var body = '计算结果：' + resultw
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write('<head><meta charset="utf-8"/></head>'); 
    response.write(body);
    response.end();  
    });
    
    });
}
//上一次计算结果页
function last_result (response,data){

	// using the promise
	var dest_account = '0xe9da1d92fa6b282f4d8d80a58f1518f0234de2eb'//用第一个unlock的账户地址来发送交易
	
	
	contractInstance.methods.getEquation().call().then(function(resultw){
	
	var body = '上一次计算结果：' + resultw
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write('<head><meta charset="utf-8"/></head>'); 
    response.write(body);
    response.end();  
    });
}

exports.index = index;
exports.count = count;
exports.result = result;
exports.last_result = last_result;