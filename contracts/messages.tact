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
message FinishDeal {
}
message AdminForceEnd {
    receiver: Address;
}
message Deposit {
}
message SetJettonWalletAddress {
    jettonWalletAddress: Address;
}
message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell? = null;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}
message(0x7362d09c) JettonTransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}
message InitDataMessage {
    jettonWalletAddress: Address;
}