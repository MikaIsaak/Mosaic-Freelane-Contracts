import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/mosaic_deal_jetton.tact',
    options: {
        debug: true,
    },
};
