import React, { useState, useEffect } from "react";
import Web3,{utils} from "web3";
import DAO from "./DAO.json";

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = new Web3(window.ethereum);
await window.ethereum.enable();
const accounts = await web3.eth.getAccounts();
setAccounts(accounts);

       // const networkId = await web3.eth.net.getId();
       // const deployedNetwork = DAO.networks[networkId];
        const contract = new web3.eth.Contract(DAO.abi,"0x6524b09dc3ae3f980d47e16f8527153a0cac0c46" );
        setContract(contract);

        const proposalCount = await contract.methods.getProposalCount().call();
        const proposals = [];
        for (let i = 0; i < proposalCount; i++) {
          const proposal = await contract.methods.getProposal(i).call();
          proposals.push({
            text: proposal[0],
            yesVotes: proposal[1],
            noVotes: proposal[2],
            isOpen: proposal[3],
          });
        }
        setProposals(proposals);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    init();
  }, []);

  const handleProposalTextChange = (event) => {
    setProposalText(event.target.value);
  };

  const handleApplyForMembership = async () => {
    try {
      setLoading(true);
      await contract.methods.applyForMembership().send({ from: accounts[0] });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error.message);
    }
  };

  const handleApproveMembership = async (memberAddress) => {
    try {
      setLoading(true);
      await contract.methods.approveMembership(memberAddress).send({ from: accounts[0] });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error.message);
    }
  };

  const handleCreateProposal = async () => {
    try {
      setLoading(true);
      await contract.methods.createProposal(proposalText).send({ from: accounts[0] });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error.message);
    }
  };

  const handleVote = async (proposalIndex, vote) => {
    try {
      setLoading(true);
      await contract.methods.vote(proposalIndex, vote).send({ from: accounts[0] });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error.message);
    }
  };

  const handleCloseProposal = async (proposalIndex) => {
    try {
      setLoading(true);
      await contract.methods.closeProposal(proposalIndex).send({ from: accounts[0] });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <h1>DAO</h1>
      <div>
        <h2>Membership</h2>
        <p>Your account: {accounts[0]}</p>
        <button onClick={handleApplyForMembership} disabled={loading}>
          Apply for Membership
        </button>
        <h3>Members</h3>
        <ul>
          {accounts.map((account, index) => (
            <li key={index}>{account}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Proposals</h2>
        <ul>
          {proposals.map((proposal, index) => (
            <li key={index}>
              <p>{proposal.text}</p>
              <p>Yes votes: {proposal.yesVotes}</p>
              <p>No votes: {proposal.noVotes}</p>
              {proposal.isOpen && (
                <>
                  <button onClick={() => handleVote(index, true)} disabled={loading}>
                    Vote Yes
                  </button>
                  <button onClick={() => handleVote(index, false)} disabled={loading}>
                    Vote No
                  </button>
                  <button onClick={() => handleCloseProposal(index)} disabled={loading}>
                    Close Proposal
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        <div>
          <h3>Create Proposal</h3>
          <input type="text" value={proposalText} onChange={handleProposalTextChange} />
          <button onClick={handleCreateProposal} disabled={loading}>
            Create Proposal
          </button>
        </div>
      </div>
    </div>
  );}
export default App;  