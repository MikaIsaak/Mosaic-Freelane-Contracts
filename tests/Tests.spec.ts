import { Blockchain, BlockchainSnapshot, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MosaicFactoryContract } from '../wrappers/MosaicFactoryContract';
import '@ton/test-utils';
import { DealContract } from '../wrappers/MosaicDealContract';
import { Address } from '@ton/core';
import exp from 'constants';
import { JettonMaster } from '../wrappers/JettonMaster';
import { JettonWallet } from '../wrappers/JettonWallet';
import { DealJetton } from '../wrappers/MosaicDealJetton';

describe('MosaicFactoryContract', () => {
    let blockchain: Blockchain;
    let snapshot: BlockchainSnapshot;
    // wallets
    let admin: SandboxContract<TreasuryContract>;
    let customer: SandboxContract<TreasuryContract>;
    let freelancer: SandboxContract<TreasuryContract>;
    // jetton wallets
    let customerJetton: SandboxContract<JettonWallet>;
    let freelancerJetton: SandboxContract<JettonWallet>;
    let dealJettonWallet: SandboxContract<JettonWallet>;
    // mosaic contracts
    let mosaicFactoryContract: SandboxContract<MosaicFactoryContract>;
    let dealContract: SandboxContract<DealContract>;
    let dealJettonContract: SandboxContract<DealJetton>;
    // jetton master
    let jettonMaster: SandboxContract<JettonMaster>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        [admin, customer, freelancer] = await blockchain.createWallets(3);
        // factory creation
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
        // deal creation
        {
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
            expect(await dealContract.getContractBalance()).toBeGreaterThanOrEqual(amount);
        }
        // jetton master creation
        {
            jettonMaster = blockchain.openContract(
                await JettonMaster.fromInit(admin.address, {
                    $$type: 'Tep64TokenData',
                    flag: 1n,
                    content: 'helpmeplz',
                }),
            );
            const deployResult = await jettonMaster.send(
                admin.getSender(),
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: 'Deploy',
                    queryId: 0n,
                },
            );
            expect(deployResult.transactions).toHaveTransaction({
                from: admin.address,
                to: jettonMaster.address,
                deploy: true,
                success: true,
            });
        }

        // mint jettons
        {
            const amount = toNano('1');
            customerJetton = blockchain.openContract(
                JettonWallet.fromAddress(await jettonMaster.getGetWalletAddress(customer.address)),
            );
            const mintResult = await jettonMaster.send(
                admin.getSender(),
                {
                    value: toNano('1'),
                },
                {
                    $$type: 'MintJetton',
                    queryId: 0n,
                    amount: amount,
                    receiver: customer.address,
                    responseDestination: customer.address,
                    forwardAmount: 0n,
                    forwardPayload: null,
                },
            );
            expect(mintResult.events.some((event) => event.type === 'account_created')).toBe(true);
            expect((await customerJetton.getGetWalletData()).balance).toEqual(amount);
        }
        // jetton deal creation
        {
            const amount = toNano('0.1');

            freelancerJetton = blockchain.openContract(
                JettonWallet.fromAddress(await jettonMaster.getGetWalletAddress(freelancer.address)),
            );

            const createDealResult = await mosaicFactoryContract.send(
                admin.getSender(),
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: 'CreateDealWithJetton',
                    id: 'sh',
                    amount: amount,
                    admin: admin.address,
                    customerAddress: customer.address,
                    customerJettonAddress: customerJetton.address,
                    freelancerAddress: freelancer.address,
                    freelancerJettonAddress: freelancerJetton.address,
                    jettonMasterAddress: jettonMaster.address,
                },
            );
            dealJettonContract = blockchain.openContract(
                await DealJetton.fromInit(
                    'sh',
                    amount,
                    admin.address,
                    customer.address,
                    customerJetton.address,
                    freelancer.address,
                    freelancerJetton.address,
                    jettonMaster.address,
                ),
            );
            dealJettonWallet = blockchain.openContract(
                JettonWallet.fromAddress(await jettonMaster.getGetWalletAddress(dealJettonContract.address)),
            );
            console.log(await dealJettonContract.getJettonWalletAddress());
            console.log(dealJettonWallet.address);
            //            expect(() == ).toBe(true);
        }
        // jetton deal deposit
        {
            // expect((await dealJettonWallet.getGetWalletData()).balance).toEqual(a);
        }

        snapshot = blockchain.snapshot();
    });

    it('should deploy', async () => {});
});
