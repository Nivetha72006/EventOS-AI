import "dotenv/config";

import orchestrator from "./orchestrator/orchestrator.service";

async function run() {

  console.log("\n==============================");
  console.log("AI ORCHESTRATOR TEST");
  console.log("==============================\n");

  // -----------------------------------------
  // 1. ASSISTANT
  // -----------------------------------------

  const assistantResult = await orchestrator.execute(
    "assistant",
    {
      message: "What should I focus on first for my wedding?",
      event: {
        id: "test-event-001",
        title: "Nivetha Wedding",
        eventType: "WEDDING",
        city: "Coimbatore",
        state: "Tamil Nadu",
        country: "India",
        guestCount: 500,
        budget: 500000,
        theme: "Traditional Tamil"
      }
    }
  );

  console.log("\nASSISTANT RESULT:");
  console.log(JSON.stringify(assistantResult, null, 2));


  // -----------------------------------------
  // 2. NEGOTIATION
  // -----------------------------------------

  const negotiationResult = await orchestrator.execute(
    "negotiation",
    {
      vendorName: "Royal Wedding Decorators",
      serviceName: "Wedding Decoration",
      vendorPrice: 180000,
      userBudget: 150000,
      eventType: "WEDDING",
      guestCount: 500
    }
  );

  console.log("\nNEGOTIATION RESULT:");
  console.log(JSON.stringify(negotiationResult, null, 2));


  // -----------------------------------------
  // 3. EMERGENCY
  // -----------------------------------------

  const emergencyResult = await orchestrator.execute(
    "emergency",
    {
      eventType: "WEDDING",
      city: "Coimbatore",
      guestCount: 500,
      budget: 150000,
      vendorCategory: "CATERING",
      unavailableVendor: "Royal Catering",
      candidates: [
        {
          id: "vendor-001",
          businessName: "Sri Lakshmi Catering",
          city: "Coimbatore",
          rating: 4.8,
          verified: true,
          status: "APPROVED",
          minimumPrice: 120000,
          maximumPrice: 180000,
          services: [
            {
              category: "CATERING",
              basePrice: 120000,
              minGuests: 100,
              maxGuests: 600,
              supportedEvents: ["WEDDING"]
            }
          ]
        }
      ]
    }
  );

  console.log("\nEMERGENCY RESULT:");
  console.log(JSON.stringify(emergencyResult, null, 2));


  console.log("\n==============================");
  console.log("ORCHESTRATOR TEST COMPLETED");
  console.log("==============================\n");
}

run().catch((error) => {
  console.error("\nORCHESTRATOR TEST FAILED:");
  console.error(error);
  process.exit(1);
});