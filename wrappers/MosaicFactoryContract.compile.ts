import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/mosaic_factory_contract.tact',
    options: {
        debug: true,
    },
};
