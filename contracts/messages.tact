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
    jettonWalletAddress: Address;
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
message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}
message(0xd1735400) TakeWalletAddress {
    queryId: Int as uint64;
    walletAddress: Address;
}

// Common

message FinishDeal {
}
message AdminForceEnd {
    receiver: Address;
}

// DealContract