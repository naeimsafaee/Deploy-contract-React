import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import contractMeta from './data.json'

const ContractDeployment = () => {
    const [contractInstance, setContractInstance] = useState(null);

    useEffect(() => {
        // Check if the user has a web3-enabled browser
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            window.ethereum.enable().then(() => {
                // Specify the network ID for Sepolia test network
                const networkId = '11155111';
                const contract = new web3.eth.Contract(contractMeta.abi);

                // Deploy the contract on Sepolia
                web3.eth.net.getId().then(async (currentNetworkId) => {
                    if (currentNetworkId.toString() !== networkId.toString()) {
                        console.error('Please connect to the Sepolia test network.');
                    } else {

                        const addresses = await web3.eth.getAccounts();

                        contract
                            .deploy({
                                data: contractMeta.bytecode, arguments: [
                                    "0xE2975661529b470923FA5d3d89Da306cC0b66C3b",
                                    "https://api.mindmint.life/nft/"
                                ]
                            })
                            .send({from: addresses[0]})
                            .then((deployedContract) => {
                                console.log('Contract deployed at:', deployedContract.options.address);
                                setContractInstance(deployedContract);
                            })
                            .catch((error) => {
                                console.error('Failed to deploy contract:', error);
                            });
                    }
                });
            });
        } else {
            console.error('Web3 is not available.');
        }
    }, []);

    return (
        <div>
            {contractInstance ? (
                <p>Contract deployed at: {contractInstance.options.address}</p>
            ) : (
                <p>Contract deployment in progress...</p>
            )}
        </div>
    );
};

export default ContractDeployment;
