import "dotenv/config";

import { AIOrchestrator } from "./orchestrator/orchestrator.service";

async function run() {

  const orchestrator = new AIOrchestrator();

  const result = await orchestrator.execute(
    "recommendation",
    {
      event: {
        title: "Nivetha Wedding",
        eventType: "Wedding",
        city: "Coimbatore",
        budget: 500000,
        guestCount: 500
      },
      vendors: [
        {
          businessName: "Dream Weddings",
          city: "Coimbatore",
          rating: 4.9,
          verified: true,
          minPrice: 300000,
          maxPrice: 600000,
          description: "Luxury wedding planners"
        },
        {
          businessName: "Royal Catering",
          city: "Coimbatore",
          rating: 4.7,
          verified: true,
          minPrice: 150000,
          maxPrice: 400000,
          description: "Traditional South Indian catering"
        }
      ]
    }
  );

  console.log(result);

}

run();