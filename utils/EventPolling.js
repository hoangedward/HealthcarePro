import web3 from '../ethereum/web3';

const poll = async (fn, time) => {
    await fn();
    setTimeout(() => poll(fn), time);
};

const watch = async (fn) => {
    let fromBlock = await web3.eth.getBlockNumber();
    poll(async () => {
        console.log('Run block adding watcher');
        let toBlock = await web3.eth.getBlockNumber();
        if (fromBlock !== toBlock) {
            fromBlock = toBlock;
            await fn();
        }
    }, 10000);
};

export default watch;