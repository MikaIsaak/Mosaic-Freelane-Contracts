import "@stdlib/deploy";
import "./models/messages.tact";

contract DealJetton with Deployable {
    id: String; // Unique identifier for the deal
    amount: Int; // Total value of the deal in TON
    admin: Address; // Administrator's address who manages the deal
    customer: Address; // Customer's address who created the deal
    freelancer: Address; // Freelancer's address who will fulfill the job
    isActive: Bool; // Boolean flag indicating if the deal is active
    isFinished: Bool; // Boolean flag indicating if the deal is finished
    jettonWalletAddress: Address;
    customerJettonAddress: Address;
    freelancerJettonAddress: Address;
    /**
    @dev Constructor to initialize the deal contract.
    @param dealId Unique identifier for the deal.
    @param admin The address of the administrator responsible for managing the deal.
    @param amount The total value of the deal in TON.
    @param customer The address of the customer who created the deal.
    @param freelancer The address of the freelancer performing the job in the deal.
    **/
    init(id: String,
        amount: Int,
        admin: Address,
        customer: Address,
        customerJettonAddress: Address,
        freelancer: Address,
        freelancerJettonAddress: Address,
        jettonMasterAddress: Address){
        // require(admin != newAddress(0, 0), "Incorrect admin address"); // Check if the admin address is valid
        // require(customer != newAddress(0, 0), "Incorrect customer address"); // Check if the customer address is valid
        // require(freelancer != newAddress(0, 0), "Incorrect freelancer address"); // Check if the freelancer address is valid
        require(amount != 0, "Incorrect amount"); // Ensure that the amount is not zero

        self.id = id; // Set the deal ID
        self.amount = amount; // Set the deal amount
        self.admin = admin; // Set the administrator's address
        self.customer = customer; // Set the customer's address
        self.freelancer = freelancer; // Set the freelancer's address
        self.isActive = false; // Mark the deal as inactive initially
        self.isFinished = false; // Mark the deal as unfinished initially
        self.jettonWalletAddress = jettonMasterAddress; // Temporary initialization
        self.freelancerJettonAddress = freelancerJettonAddress;
        self.customerJettonAddress = customerJettonAddress;
        send(SendParameters{
                to: jettonMasterAddress,
                value: 0,
                mode: SendRemainingValue,
                body: ProvideWalletAddress{queryId: now(), ownerAddress: myAddress(), includeAddress: false}.toCell()
            }
        );
    }

    receive(msg: TakeWalletAddress){
        require(sender() == self.jettonWalletAddress, "unauthorized"); // jettonWalletAddress is master address, before we change it
        self.jettonWalletAddress = msg.walletAddress;
    }

    receive(msg: Excesses){}

    /**
    @dev Notification message receiver.
    **/
    receive(msg: JettonTransferNotification){
        require(self.isActive == false, "Deal is already laucnhed");
        require(self.isFinished == false, "Deal is already finished");
        require(sender() == self.jettonWalletAddress, "Incorrect sender");
        require(msg.amount >= self.amount, "Incorrect amount");
        self.isActive = true;
    }

    /**
    @dev Marks the deal as finished by the customer and transfers the remaining balance to the freelancer.
    @param msg The message indicating the deal should be completed.
    **/
    receive(msg: FinishDeal){
        require(context().sender == self.customer, "Incorrect sender"); // Ensure the sender is the customer
        require(self.isActive == true, "Deal isn't active"); // Ensure the deal is active
        require(context().value >= ton("0.05"), "Message value is too low"); // Ensure the message value is at least 0.15 TON

        self.isActive = false; // Mark the deal as inactive
        self.isFinished = true; // Mark the deal as finished

        send(SendParameters{
                to: self.freelancerJettonAddress,
                value: 0,
                mode: SendRemainingValue,
                bounce: false,
                body: JettonTransfer{
                    queryId: 1,
                    amount: self.amount,
                    destination: self.freelancer,
                    responseDestination: self.customer,
                    customPayload: null,
                    forwardAmount: 1,
                    forwardPayload: null
                }.toCell()
            }
        );
    }

    /**
    @dev Allows the admin to forcibly finish the deal and transfer the remaining balance to either the customer or freelancer.
    @param msg The message containing the deal information and the receiver address.
    **/
    receive(msg: AdminForceEnd){
        require(context().sender == self.admin, "Non-admin address can't finish this deal"); // Check if the sender is the admin
        require(msg.receiver == self.customer || msg.receiver == self.freelancer, "Incorrect receiver address"); // Validate the receiver address
        require(self.isActive == true, "Deal isn't active"); // Ensure the deal is active

        self.isActive = false; // Mark the deal as inactive
        self.isFinished = true; // Mark the deal as finished
        send(SendParameters{to: msg.receiver, bounce: true, value: 0, mode: SendRemainingBalance + SendIgnoreErrors}); // Transfer the remaining balance to the specified receiver
    }

    /**
    @dev Getter function for deal ID.
    @return The deal ID.
    **/
    get fun id(): String {
        return self.id;
    }

    /**
    @dev Getter function for deal amount.
    @return The total value of the deal.
    **/

    get fun amount(): Int {
        return self.amount;
    }

    /**
    @dev Getter function for admin address.
    @return The admin's address.
    **/

    get fun admin(): Address {
        return self.admin;
    }

    /**
    @dev Getter function for customer address.
    @return The customer's address.
    **/

    get fun customer(): Address {
        return self.customer;
    }

    /**
    @dev Getter function for freelancer address.
    @return The freelancer's address.
    **/

    get fun freelancer(): Address {
        return self.freelancer;
    }

    /**
    @dev Getter function for the deal's active status.
    @return True if the deal is active, false otherwise.
    **/

    get fun isActive(): Bool {
        return self.isActive;
    }

    get fun isFinished(): Bool {
        return self.isFinished;
    }

    /**
    @dev Getter function for the contract's balance.
    @return The current balance of the contract.
    **/

    get fun contractBalance(): Int {
        return myBalance(); // Return the current balance of the contract
    }

    get fun jettonWalletAddress(): Address {
        return self.jettonWalletAddress;
    }
}