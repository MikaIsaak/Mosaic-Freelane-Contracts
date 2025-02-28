import { toNano } from '@ton/core';
import { MosaicFactoryContract } from '../wrappers/MosaicFactoryContract';
import { DealContract } from '../wrappers/MosaicDealContract';
import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';
import * as fs from 'fs';

export async function run(provider: NetworkProvider) {
    const mosaicFactoryContract = provider.open(await MosaicFactoryContract.fromInit());

    await mosaicFactoryContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(mosaicFactoryContract.address);
}
