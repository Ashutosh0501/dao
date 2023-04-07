import React, { useState, useEffect } from "react";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);

const DAO_ADDRESS = "0xF2486518c6dC9C4EBA4e10f5884505Cea2A6d6Af"; 
const DAO_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "applyForMembership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_memberAddress",
        "type": "address"
      }
    ],
    "name": "approveMembership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_proposalIndex",
        "type": "uint256"
      }
    ],
    "name": "closeProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_proposalText",
        "type": "string"
      }
    ],
    "name": "createProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_proposalIndex",
        "type": "uint256"
      }
    ],
    "name": "getProposal",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProposalCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "members",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hasVoted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "proposals",
    "outputs": [
      {
        "internalType": "string",
        "name": "proposalText",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "yesVotes",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "noVotes",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isOpen",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_proposalIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_vote",
        "type": "bool"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [proposals, setProposals] = useState([]);
  const[aaddress, setaaddress]=useState("");
  const proposalCount=0;
  useEffect(() => {
    const connectToWeb3 = async () => {
      try {
        await window.ethereum.enable();
        setIsConnected(true);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const daoContract = new web3.eth.Contract(DAO_ABI, DAO_ADDRESS);
        const proposalCount = await daoContract.methods.getProposalCount().call();
        const proposals = await Promise.all(
          Array.from({ length: proposalCount }, (_, i) =>
            daoContract.methods.getProposal(i).call()
          )
        );
        setProposals(proposals);
      } catch (error) {
        console.error(error);
      }
    };
    connectToWeb3();
  }, []);

  const handleApplyForMembership = async () => {
    const daoContract = new web3.eth.Contract(DAO_ABI, DAO_ADDRESS);
    await daoContract.methods.applyForMembership().send({ from: account });
  };

  const handleCreateProposal = async () => {
    const daoContract = new web3.eth.Contract(DAO_ABI, DAO_ADDRESS);
    await daoContract.methods.createProposal(proposalText).send({ from: account });
    setProposalText("");
    proposalCount++;
  };

  const handleVote = async (proposalIndex, vote) => {
    const daoContract = new web3.eth.Contract(DAO_ABI, DAO_ADDRESS);
    await daoContract.methods.vote(proposalIndex, vote).send({ from: account });
    const proposals = await Promise.all(
      Array.from({ length: proposalCount }, (_, i) =>
        daoContract.methods.getProposal(i).call()
      )
    );
    setProposals(proposals);
  };

  const handleApproveMembership = async (memberAddress) => {
    const daoContract = new web3.eth.Contract(DAO_ABI, DAO_ADDRESS);
    await daoContract.methods.approveMembership(memberAddress).send({ from: account });
  };
  

  const handleCloseProposal = async (proposalIndex) => {
    const daoContract = new web3.eth.Contract(DAO_ABI, DAO_ADDRESS);
    await daoContract.methods.closeProposal(proposalIndex).send({ from: account });
    const proposals = await Promise.all(
      Array.from({ length: proposalCount }, (_, i) =>
        daoContract.methods.getProposal(i).call()
      )
    );
    setProposals(proposals);
  };

  if (!isConnected) {
    return <div>Connecting to Web3...</div>;
  }

  return (
    <div>
      <h1>DAO App</h1>
      <div>Connected account: {account}</div>
      <button onClick={handleApplyForMembership}>Apply for membership</button>
      <h2>Create a proposal</h2>
      <div>
        <input type="text" value={proposalText} onChange={(e) => setProposalText(e.target.value)} />
        <button onClick={handleCreateProposal}>Create</button>
      </div>
      <h2>Proposals</h2>
      {proposals.map((proposal,index) => (
<div key={index}>
<h3>{proposal.title}</h3>
<p>{proposal.description}</p>
<p>Votes: {proposal.yesVotes} yes / {proposal.noVotes} no</p>
<button onClick={() => handleVote(index, true)}>Vote yes</button>
<button onClick={() => handleVote(index, false)}>Vote no</button>
<button onClick={() => handleCloseProposal(index)}>Close proposal</button>
</div>
))}


<ul>
  <h2>approve Membership</h2>
<input type="text" value={aaddress} onChange={(e) => setaaddress(e.target.value)} />
       
<button onClick={() => handleApproveMembership(aaddress)}>Approve</button>

</ul>
</div>
);
}

export default App;






