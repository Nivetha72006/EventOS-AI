import repository from "./marketplace.repository";
import { MarketplaceFilters } from "./marketplace.types";

class MarketplaceService {

  async getMarketplace(
    eventId: string,
    filters: MarketplaceFilters = {}
  ) {
    return repository.getVendorsForEvent(
      eventId,
      filters
    );
  }

}

export default new MarketplaceService();