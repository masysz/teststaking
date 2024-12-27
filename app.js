const provider = new ethers.providers.Web3Provider(window.ethereum);
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
        try {
            console.log('Requesting accounts...');
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts requested successfully.');

            console.log('Getting network...');
            const network = await provider.getNetwork();
            console.log('Network:', network);

            const chainId = network.chainId;
            console.log('Chain ID:', chainId);

            if (chainId !== 1480) {
                alert('Please switch to Vana network in MetaMask.');
                return;
            }

            console.log('Getting signer...');
            signer = provider.getSigner();
            console.log('Signer:', signer);

            console.log('Creating contract...');
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log('Contract:', contract);

            document.getElementById('stakeButton').disabled = false;
            document.getElementById('withdrawButton').disabled = false;
            document.getElementById('calculateRewardButton').disabled = false;

            console.log('Updating info...');
            updateInfo();
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect to MetaMask.');
        }
    } else {
        alert('MetaMask is not installed!');
    }
});

document.getElementById('stakeButton').addEventListener('click', async () => {
    const amount = ethers.utils.parseEther(prompt("Enter amount to stake (in VANA):"));
    try {
        console.log('Staking...');
        const tx = await contract.stake({ value: amount });
        console.log('Transaction:', tx);
        await tx.wait();
        console.log('Transaction confirmed.');
        alert('Staked successfully!');
        updateInfo();
    } catch (error) {
        console.error('Staking failed:', error);
        alert('Staking failed.');
    }
});

document.getElementById('withdrawButton').addEventListener('click', async () => {
    try {
        console.log('Withdrawing...');
        const tx = await contract.withdraw();
        console.log('Transaction:', tx);
        await tx.wait();
        console.log('Transaction confirmed.');
        alert('Withdrawn successfully!');
        updateInfo();
    } catch (error) {
        console.error('Withdraw failed:', error);
        alert('Withdraw failed.');
    }
});

document.getElementById('calculateRewardButton').addEventListener('click', async () => {
    try {
        console.log('Calculating reward...');
        const userAddress = await signer.getAddress();
        console.log('User Address:', userAddress);
        const reward = await contract.calculateReward(userAddress);
        console.log('Reward:', reward);
        document.getElementById('userRewardInfo').innerText = `User Reward: ${ethers.utils.formatEther(reward)} VANA`;
    } catch (error) {
        console.error('Failed to calculate reward:', error);
        alert('Failed to calculate reward.');
    }
});

async function updateInfo() {
    try {
        console.log('Updating APY...');
        const apy = await contract.apy();
        console.log('APY:', apy);

        console.log('Updating total staked...');
        const totalStaked = await contract.totalStaked();
        console.log('Total Staked:', totalStaked);

        console.log('Updating total reward pool...');
        const totalRewardPool = await contract.totalRewardPool();
        console.log('Total Reward Pool:', totalRewardPool);

        console.log('Getting user address...');
        const userAddress = await signer.getAddress();
        console.log('User Address:', userAddress);

        console.log('Updating user stake...');
        const userStake = await contract.stakes(userAddress);
        console.log('User Stake:', userStake);

        console.log('Calculating user reward...');
        const userReward = await contract.calculateReward(userAddress);
        console.log('User Reward:', userReward);

        document.getElementById('apyInfo').innerText = `APY: ${apy.toString()} %`;
        document.getElementById('totalStakedInfo').innerText = `Total Staked: ${ethers.utils.formatEther(totalStaked)} VANA`;
        document.getElementById('totalRewardPoolInfo').innerText = `Total Reward Pool: ${ethers.utils.formatEther(totalRewardPool)} VANA`;
        document.getElementById('userStakeInfo').innerText = `User Stake: ${ethers.utils.formatEther(userStake.amount)} VANA`;
        document.getElementById('userRewardInfo').innerText = `User Reward: ${ethers.utils.formatEther(userReward)} VANA`;
    } catch (error) {
        console.error('Failed to update information:', error);
        alert('Failed to update information.');
    }
}
