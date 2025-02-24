import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MosaicFactoryContract } from '../wrappers/MosaicFactoryContract';
import '@ton/test-utils';
import { MosaicDealContract } from '../wrappers/MosaicDealContract';
import { Address } from '@ton/core';
import exp from 'constants';

describe('MosaicFactoryContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let mosaicFactoryContract: SandboxContract<MosaicFactoryContract>;
    let mosaicDealContract: SandboxContract<MosaicDealContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        mosaicFactoryContract = blockchain.openContract(await MosaicFactoryContract.fromInit());
        mosaicDealContract = blockchain.openContract(
            await MosaicDealContract.fromInit(
                'sh',
                toNano('0.1'),
                deployer.address,
                deployer.address,
                deployer.address,
            ),
        );

        const deployResult = await mosaicFactoryContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        await mosaicFactoryContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'CreateDeal',
                id: 'sh',
                amount: toNano('0.1'),
                admin: deployer.address,
                customer: deployer.address,
                freelancer: deployer.address,
            },
        );

        await mosaicDealContract.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'Deposit',
            },
        );
        expect(await mosaicDealContract.getAdmin()).toEqualAddress(deployer.address);
        expect(await mosaicDealContract.getContractBalance()).toBeGreaterThan(0n);

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: mosaicFactoryContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should send money to freelancer after deal finished', async () => {
        const userBalanceBefore = await deployer.getBalance();
        console.log('balance before withdraw', userBalanceBefore);
        await mosaicDealContract.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'FinishDeal',
            },
        );
        const userBalanceAfter = await deployer.getBalance();
        console.log('balance after withdraw', userBalanceAfter);
        console.log(userBalanceAfter - userBalanceBefore);
        expect(await mosaicDealContract.getContractBalance()).toBe(0n);
        expect(await deployer.getBalance()).toBeGreaterThan(0n);
    });

    it('should deploy', async () => {
        console.log('balance before withdraw', await mosaicDealContract.getContractBalance());

        await mosaicDealContract.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'FinishDeal',
            },
        );
    });
});
