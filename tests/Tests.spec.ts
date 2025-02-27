import { Blockchain, BlockchainSnapshot, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MosaicFactoryContract } from '../wrappers/MosaicFactoryContract';
import '@ton/test-utils';
import { DealContract } from '../wrappers/MosaicDealContract';
import { Address } from '@ton/core';
import exp from 'constants';

describe('MosaicFactoryContract', () => {
    let blockchain: Blockchain;
    let customer: SandboxContract<TreasuryContract>;
    let freelancer: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let snapshot: BlockchainSnapshot;
    let mosaicFactoryContract: SandboxContract<MosaicFactoryContract>;
    let dealContract: SandboxContract<DealContract>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        [admin, customer, freelancer] = await blockchain.createWallets(3);
        {
            mosaicFactoryContract = blockchain.openContract(await MosaicFactoryContract.fromInit());
            const deployResult = await mosaicFactoryContract.send(
                admin.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Deploy',
                    queryId: 0n,
                },
            );
            expect(deployResult.transactions).toHaveTransaction({
                from: admin.address,
                to: mosaicFactoryContract.address,
                deploy: true,
                success: true,
            });
        }

        {
            mosaicFactoryContract = blockchain.openContract(await MosaicFactoryContract.fromInit());
            const amount = toNano('0.1');
            const createDealResult = await mosaicFactoryContract.send(
                admin.getSender(),
                {
                    value: toNano('0.16'),
                },
                {
                    $$type: 'CreateDeal',
                    id: 'sh',
                    amount: amount,
                    admin: admin.address,
                    customer: customer.address,
                    freelancer: freelancer.address,
                },
            );
            dealContract = blockchain.openContract(
                await DealContract.fromInit('sh', amount, admin.address, customer.address, freelancer.address),
            );
            expect((await dealContract.getContractBalance()) >= amount).toBe(true);
        }

        snapshot = blockchain.snapshot();
    });

    it('should deploy', async () => {});
});
