import { toNano } from '@ton/core';
import { MosaicDealContract } from '../wrappers/MosaicDealContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mosaicDealContract = provider.open(await MosaicDealContract.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await mosaicDealContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(mosaicDealContract.address);

    console.log('ID', await mosaicDealContract.getId());
}
