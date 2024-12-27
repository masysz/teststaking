const provider = new ethers.providers.JsonRpcProvider("https://rpc.vana.org");
let signer;
let contract;

const contractAddress = "0xfABa86c326d2031D6ECFa8345F7Cd70F2eB764A3";
const contractABI = [
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
];

document.getElementById('connectButton').addEventListener('click', async () => {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        document.getElementById('stakeButton').disabled = false;
        document.getElementById('withdrawButton').disabled = false;
        document.getElementById('calculateRewardButton').disabled = false;
        updateInfo();
    } else {
        alert('MetaMask is not installed!');
    }
});

document.getElementById('stakeButton').addEventListener('click', async () => {
    const amount = ethers.utils.parseEther(prompt("Enter amount to stake (in VANA):"));
    const tx = await contract.stake({ value: amount });
    await tx.wait();
    alert('Staked successfully!');
    updateInfo();
});

document.getElementById('withdrawButton').addEventListener('click', async () => {
    const tx = await contract.withdraw();
    await tx.wait();
    alert('Withdrawn successfully!');
    updateInfo();
});

document.getElementById('calculateRewardButton').addEventListener('click', async () => {
    const userAddress = await signer.getAddress();
    const reward = await contract.calculateReward(userAddress);
    document.getElementById('userRewardInfo').innerText = `User Reward: ${ethers.utils.formatEther(reward)} VANA`;
});

async function updateInfo() {
    const apy = await contract.apy();
    const totalStaked = await contract.totalStaked();
    const totalRewardPool = await contract.totalRewardPool();
    const userAddress = await signer.getAddress();
    const userStake = await contract.stakes(userAddress);
    const userReward = await contract.calculateReward(userAddress);

    document.getElementById('apyInfo').innerText = `APY: ${apy.toString()} %`;
    document.getElementById('totalStakedInfo').innerText = `Total Staked: ${ethers.utils.formatEther(totalStaked)} VANA`;
    document.getElementById('totalRewardPoolInfo').innerText = `Total Reward Pool: ${ethers.utils.formatEther(totalRewardPool)} VANA`;
    document.getElementById('userStakeInfo').innerText = `User Stake: ${ethers.utils.formatEther(userStake.amount)} VANA`;
    document.getElementById('userRewardInfo').innerText = `User Reward: ${ethers.utils.formatEther(userReward)} VANA`;
}
