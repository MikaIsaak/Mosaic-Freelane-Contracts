import "@stdlib/deploy";
import "./mosaic_deal_contract.tact";
import "./mosaic_deal_jetton.tact";
import "./messages.tact";

contract MosaicFactoryContract with Deployable {
    init(){}

    /**
    @dev Creates a deal and deploys a child contract.
    @param msg Struct CreateDeal, containing the details of the new deal.
    **/
    receive(msg: CreateDeal){
        let init: StateInit = initOf DealContract(msg.id, msg.amount, msg.admin, msg.customer, msg.freelancer);
        let dealContractAddress: Address = contractAddress(init);
        send(SendParameters{
                to: dealContractAddress,
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "Deposit".asComment(),
                code: init.code,
                data: init.data
            }
        );
        // send(SendParameters{to: contractAddress(init), bounce: false, value: 0, mode: SendRemainingValue});
    }

    /**
    @dev Returns the address of a child contract.
    
    @param dealId The id of the deal.
    @return Address of the child contract.
    **/
    get fun addressOfChildWithTon(msg: CreateDeal): Address {
        let init: StateInit = initOf DealContract(msg.id, msg.amount, msg.admin, msg.customer, msg.freelancer);
        return contractAddress(init);
    }
}