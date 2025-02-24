import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MosaicDealJetton } from '../wrappers/MosaicDealJetton';
import '@ton/test-utils';

describe('MosaicDealJetton', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let mosaicDealJetton: SandboxContract<MosaicDealJetton>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        mosaicDealJetton = blockchain.openContract(await MosaicDealJetton.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await mosaicDealJetton.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: mosaicDealJetton.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and mosaicDealJetton are ready to use
    });
});
