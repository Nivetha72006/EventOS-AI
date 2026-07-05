import repository from "./marketplace.repository";

class MarketplaceService {

  getMarketplace(eventId: string) {

    return repository.getVendorsForEvent(eventId);

  }

}

export default new MarketplaceService();