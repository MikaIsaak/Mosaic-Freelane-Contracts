import "@stdlib/deploy";
import "./mosaic_deal_contract.tact";
import "./messages.tact";

contract MosaicFactoryContract with Deployable {
    init(){}

    /**
    @dev Creates a deal and deploys a child contract.
    @param msg Struct CreateDeal, containing the details of the new deal.
    **/
    receive(msg: CreateDeal){
        let init: StateInit = initOf MosaicDealContract(msg.id, msg.amount, msg.admin, msg.customer, msg.freelancer);
        send(SendParameters{
                to: contractAddress(init),
                value: context().value,
                mode: SendRemainingValue,
                code: init.code,
                data: init.data
            }
        );
    }

    /**
    @dev Returns the address of a child contract.
    
    @param dealId The id of the deal.
    @return Address of the child contract.
    **/
    get fun addressOfChildWithTon(msg: CreateDeal): Address {
        let init: StateInit = initOf MosaicDealContract(msg.id, msg.amount, msg.admin, msg.customer, msg.freelancer);
        return contractAddress(init);
    }
}