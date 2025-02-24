import { toNano } from '@ton/core';
import { MosaicFactoryContract } from '../wrappers/MosaicFactoryContract';
import { MosaicDealContract } from '../wrappers/MosaicDealContract';
import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';

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

    // run methods on `mosaicFactoryContract`

    await mosaicFactoryContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'CreateDeal',
            id: 'sh',
            amount: toNano('0.1'),
            admin: provider.sender().address!,
            customer: provider.sender().address!,
            freelancer: provider.sender().address!,
        },
    );
    await new Promise((resolve) => setTimeout(resolve, 15000));

    const mosaicDealContract = provider.open(
        await MosaicDealContract.fromInit(
            'sh',
            toNano('0.1'),
            provider.sender().address!,
            provider.sender().address!,
            provider.sender().address!,
        ),
    );
    await new Promise((resolve) => setTimeout(resolve, 15000));

    console.log('Deal activity: ', await mosaicDealContract.getIsActive());

    mosaicDealContract.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type: 'Deposit',
        },
    );

    await new Promise((resolve) => setTimeout(resolve, 15000));

    console.log('Deal activity: ', await mosaicDealContract.getIsActive());
}
