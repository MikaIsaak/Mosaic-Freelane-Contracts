import { toNano } from '@ton/core';
import { MosaicDealJetton } from '../wrappers/MosaicDealJetton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mosaicDealJetton = provider.open(await MosaicDealJetton.fromInit());

    await mosaicDealJetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(mosaicDealJetton.address);

    // run methods on `mosaicDealJetton`
}
