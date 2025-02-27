import "@stdlib/deploy";
import "./mosaic_deal_contract.tact";
import "./mosaic_deal_jetton.tact";
import "./models/messages.tact";

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
    }

    receive(msg: CreateDealWithJetton){
        let init: StateInit = initOf DealJetton(msg.id,
            msg.amount,
            msg.admin,
            msg.customerAddress,
            msg.customerJettonAddress,
            msg.freelancerAddress,
            msg.freelancerJettonAddress,
            msg.jettonMasterAddress
        );
        let dealJettonAddress: Address = contractAddress(init);
        send(SendParameters{
            to: dealJettonAddress,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            code: init.code,
            data: init.data
        })
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

    get fun addressOfChildWithJetton(msg: CreateDealWithJetton): Address {
        let init: StateInit = initOf DealJetton(msg.id,
            msg.amount,
            msg.admin,
            msg.customerAddress,
            msg.customerJettonAddress,
            msg.freelancerAddress,
            msg.freelancerJettonAddress,
            msg.jettonMasterAddress
        );
        return contractAddress(init);
    }
}