const stakingContractAddress = "0xfABa86c326d2031D6ECFa8345F7Cd70F2eB764A3"; // Replace with your contract address
const stakingAbi = [
    //[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "devWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_vanaticToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "dev",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "DevWithdrawn",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "stake",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Staked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawRewardPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "apy",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "calculateReward",
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
		"inputs": [],
		"name": "LOCK_PERIOD",
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
		"inputs": [],
		"name": "owner",
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
		"name": "SECONDS_IN_A_YEAR",
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
		"name": "stakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rewardDebt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalRewardPool",
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
		"inputs": [],
		"name": "totalStaked",
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
		"inputs": [],
		"name": "vanaticToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
];

let web3;
let stakingContract;
let userAddress;

window.addEventListener("load", async () => {
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        stakingContract = new web3.eth.Contract(stakingAbi, stakingContractAddress);

        document.getElementById("connectWallet").onclick = connectWallet;
        document.getElementById("stake").onclick = stakeTokens;
        document.getElementById("withdraw").onclick = withdrawTokens;
        document.getElementById("claim").onclick = claimRewards;
    } else {
        alert("Please install MetaMask!");
    }
});

async function connectWallet() {
    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];
        document.getElementById("output").innerText = `Connected: ${userAddress}`;
    } catch (error) {
        console.error(error);
    }
}

async function stakeTokens() {
    const amount = document.getElementById("stakeAmount").value;
    if (!amount || amount <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    try {
        await stakingContract.methods.stake().send({
            from: userAddress,
            value: web3.utils.toWei(amount, "ether"),
        });
        document.getElementById("output").innerText = `Staked ${amount} ETH successfully!`;
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = `Error: ${error.message}`;
    }
}

async function withdrawTokens() {
    try {
        await stakingContract.methods.withdraw().send({ from: userAddress });
        document.getElementById("output").innerText = "Withdrawn successfully!";
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = `Error: ${error.message}`;
    }
}

async function claimRewards() {
    try {
        const reward = await stakingContract.methods.calculateReward(userAddress).call();
        document.getElementById("output").innerText = `Claimed rewards: ${web3.utils.fromWei(reward, "ether")} VANA`;
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = `Error: ${error.message}`;
    }
}
