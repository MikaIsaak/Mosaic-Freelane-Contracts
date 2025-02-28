import { toNano } from '@ton/core';
import { MosaicFactoryContract } from '../wrappers/MosaicFactoryContract';
import { NetworkProvider } from '@ton/blueprint';
import { FACTORY_ADDRESS } from './consts';

export async function run(provider: NetworkProvider) {
    const factoryContract = provider.open(await MosaicFactoryContract.fromAddress(FACTORY_ADDRESS));
    const amount = toNano('0.1'); // CHANGE ME
    const admin = provider.sender().address!!; // CHANGE ME
    const customer = provider.sender().address!!; // CHANGE ME
    const freelancer = provider.sender().address!!; // CHANGE ME

    await factoryContract.send(
        provider.sender(),
        {
            value: amount + toNano('0.06'),
        },
        {
            $$type: 'CreateDeal',
            id: 'sh',
            amount: amount,
            admin: admin,
            customer: customer,
            freelancer: freelancer,
        },
    );
}
