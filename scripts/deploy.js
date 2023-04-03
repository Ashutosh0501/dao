const Web3 = require('web3');
const DAO = require('../src/DAO.json');

async function main() {
  // Set up a web3 provider and signer
  const web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  
  const signer = web3.eth.accounts.privateKeyToAccount('').signer; // update with your private key

  // Deploy the contract
  const daoFactory = new web3.eth.Contract(DAO.abi, null, { data: DAO.bytecode, from: accounts[0] });
  const dao = await daoFactory.deploy().send({ from: accounts[0], gas: 1500000, gasPrice: '30000000000' });

  console.log("DAO contract deployed to:", dao.options.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
