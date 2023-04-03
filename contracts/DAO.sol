pragma solidity ^0.6.0;

contract DAO {
    address public admin;
    
    struct Member {
        bool isApproved;
        bool hasVoted;
    }
    
    mapping(address => Member) public members;
    
    struct Proposal {
        string proposalText;
        uint256 yesVotes;
        uint256 noVotes;
        bool isOpen;
        mapping(address => bool) votes;
    }
    
    Proposal[] public proposals;
    
    constructor() public {
        admin = msg.sender;
    }
    
    function applyForMembership() public {
        require(!members[msg.sender].isApproved, "You are already a member");
        members[msg.sender].isApproved = false;
    }
    
    function approveMembership(address _memberAddress) public onlyAdmin {
        require(!members[_memberAddress].isApproved, "Member already approved");
        members[_memberAddress].isApproved = true;
    }
    
    function createProposal(string memory _proposalText) public onlyMember {
        proposals.push(Proposal({
            proposalText: _proposalText,
            yesVotes: 0,
            noVotes: 0,
            isOpen: true
        }));
    }
    
    function vote(uint256 _proposalIndex, bool _vote) public onlyMember {
        require(proposals[_proposalIndex].isOpen, "Proposal is closed");
        require(!members[msg.sender].hasVoted, "You have already voted");
        proposals[_proposalIndex].votes[msg.sender] = _vote;
        if (_vote) {
            proposals[_proposalIndex].yesVotes++;
        } else {
            proposals[_proposalIndex].noVotes++;
        }
        members[msg.sender].hasVoted = true;
    }
    
    function closeProposal(uint256 _proposalIndex) public onlyAdmin {
        require(proposals[_proposalIndex].isOpen, "Proposal is already closed");
        proposals[_proposalIndex].isOpen = false;
    }
    
    function getProposalCount() public view returns (uint256) {
        return proposals.length;
    }
    
    function getProposal(uint256 _proposalIndex) public view returns (string memory, uint256, uint256, bool) {
        return (proposals[_proposalIndex].proposalText, proposals[_proposalIndex].yesVotes, proposals[_proposalIndex].noVotes, proposals[_proposalIndex].isOpen);
    }
    
    modifier onlyAdmin {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyMember {
        require(members[msg.sender].isApproved, "You are not a member");
        _;
    }
}
