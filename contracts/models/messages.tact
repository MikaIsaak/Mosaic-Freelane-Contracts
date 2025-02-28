// -------------------------------------
// TEP-74: Standard Jettom messages
// https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
// -------------------------------------

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    // the amount of jettons to transfer
    amount: Int as coins;
    // the address of the jetton receiver
    destination: Address;
    // the address to send the excesses to
    responseDestination: Address;
    // the custom payload to be sent with the excesses
    customPayload: Cell?;
    // the amount of TON coins to forward,
    // if not zero, will send additional msg with the specified amount
    forwardAmount: Int as coins;
    // the payload to forward
    forwardPayload: Cell?;
}
// transfer tokens between jetton wallets or master contract
message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    responseDestination: Address;
    forwardAmount: Int as coins;
    forwardPayload: Cell?;
}
message(0x7362d09c) TransferNotification {
    queryId: Int as uint64;
    // the amount of jettons transferred
    amount: Int as coins;
    // the address of the jetton sender
    sender: Address;
    forwardPayload: Cell?;
}
message(0x595f07bc) Burn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    customPayload: Cell?;
}
message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address;
}
message(0xd53276db) Excesses {
    queryId: Int as uint64;
}
// -------------------------------------
// TEP-89: Discoverable Jettons Wallets
// https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
// -------------------------------------

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}
message(0xd1735400) TakeWalletAddress {
    queryId: Int as uint64;
    // if it is not possible to generate wallet address
    // for address in question (for instance wrong workchain)
    // wallet_address in take_wallet_address
    // should be equal to addr_none
    walletAddress: Address;

    // If include_address is set to True,
    // take_wallet_address should include
    // owner_address equal to owner_address in request
    // ownerAddress: Address?;  // IF THIS IS ADDED IT IS NOT WORKING WITH USDT
}
// -------------------------------------
// Custom Jetton messages and structs
// -------------------------------------

message(0xa593886f) MintJetton {
    queryId: Int as uint64;
    amount: Int;
    receiver: Address;
    responseDestination: Address;
    forwardAmount: Int as coins;
    forwardPayload: Cell?;
}
struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}
struct JettonMasterData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}
struct Tep64TokenData {
    // flag is the flag of the content type.
    // 0 means on-chain, 1 means off-chain.
    flag: Int as uint8;
    content: String;
}
//
//
//

// FactoryContract
message CreateDeal {
    id: String;
    amount: Int as coins;
    admin: Address;
    customer: Address;
    freelancer: Address;
}
message CreateDealWithJetton {
    id: String;
    amount: Int as coins;
    admin: Address;
    customer: Address;
    freelancer: Address;
    jettonMaster: Address;
}
// DealJetton
message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardAmount: Int as coins;
    forwardPayload: Cell?;
}
message(0x7362d09c) JettonTransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Cell?;
}
// Common

message AdminForceEnd {
    receiver: Address;
}

// DealContract