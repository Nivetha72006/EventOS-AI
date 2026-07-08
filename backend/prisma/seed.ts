import {
  PrismaClient,
  Role,
  VendorStatus,
  VendorCategory,
  EventType
} from "@prisma/client";

import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Seeding database...");

  const users = [];

  for (let i = 1; i <= 10; i++) {

    const user = await prisma.user.create({

      data: {

        name: faker.person.fullName(),

        email: `user${i}@eventos.com`,

        password: "123456",

        role: Role.USER,

        isVerified: true

      }

    });

    users.push(user);

  }

  console.log(`✅ Created ${users.length} users`);

  const vendors = [];

for (let i = 0; i < users.length; i++) {

  const vendor = await prisma.vendor.create({

    data: {

      ownerId: users[i].id,

      businessName: faker.company.name(),

      description: faker.company.catchPhrase(),

      experience: faker.number.int({ min: 1, max: 20 }),

      verified: true,

      rating: faker.number.float({
        min: 3.5,
        max: 5,
        fractionDigits: 1
      }),

      status: VendorStatus.APPROVED,

      address: faker.location.streetAddress(),

      city: "Coimbatore",

      state: "Tamil Nadu",

      country: "India",

      latitude: 11.0168,

      longitude: 76.9558,

      minimumPrice: faker.number.int({
        min: 30000,
        max: 80000
      }),

      maximumPrice: faker.number.int({
        min: 150000,
        max: 500000
      }),

      phone: faker.phone.number(),

      website: faker.internet.url()

    }

  });

  vendors.push(vendor);

}

console.log(`✅ Created ${vendors.length} vendors`);

const categories = [

  VendorCategory.CATERING,
  VendorCategory.DECORATION,
  VendorCategory.PHOTOGRAPHY,
  VendorCategory.VIDEOGRAPHY,
  VendorCategory.MUSIC

];

const eventTypes = [

  EventType.WEDDING,
  EventType.BIRTHDAY,
  EventType.CORPORATE

];

let serviceCount = 0;

for (const vendor of vendors) {

  for (let i = 0; i < 4; i++) {

    await prisma.vendorService.create({

      data: {

        vendorId: vendor.id,

        category: faker.helpers.arrayElement(categories),

        title: faker.commerce.productName(),

        description: faker.lorem.sentence(),

        basePrice: faker.number.int({

          min: 15000,

          max: 200000

        }),

        minGuests: 50,

        maxGuests: 1000,

        supportedEvents: faker.helpers.arrayElements(

          eventTypes,

          {

            min: 1,

            max: 3

          }

        )

      }

    });

    serviceCount++;

  }

}

console.log(`✅ Created ${serviceCount} vendor services`);

const events = [];

for (let i = 0; i < 15; i++) {

  const user = users[i % users.length];

  const event = await prisma.event.create({

    data: {

      title: faker.helpers.arrayElement([
        "Grand Wedding",
        "Birthday Celebration",
        "Corporate Meet",
        "Reception",
        "Engagement Ceremony"
      ]),

      eventType: faker.helpers.arrayElement(eventTypes),

      eventDate: faker.date.future(),

      city: "Coimbatore",

      state: "Tamil Nadu",

      country: "India",

      guestCount: faker.number.int({
        min: 100,
        max: 1000
      }),

      budget: faker.number.int({
        min: 100000,
        max: 1000000
      }),

      description: faker.lorem.sentence(),

      theme: faker.helpers.arrayElement([
        "Royal",
        "Traditional",
        "Modern",
        "Luxury"
      ]),

      preferredColors: ["Red", "Gold"],

      userId: user.id

    }

  });

  events.push(event);

}

console.log(`✅ Created ${events.length} events`);

const bookings = [];

for (let i = 0; i < 30; i++) {

  const event = faker.helpers.arrayElement(events);

  const vendor = faker.helpers.arrayElement(vendors);

  const vendorServices = await prisma.vendorService.findMany({

    where: {

      vendorId: vendor.id

    }

  });

  if (vendorServices.length === 0) continue;

  const service = faker.helpers.arrayElement(vendorServices);

  const booking = await prisma.booking.create({

    data: {

      userId: event.userId,

      eventId: event.id,

      vendorId: vendor.id,

      serviceId: service.id,

      notes: faker.lorem.sentence(),

      status: "PENDING"

    }

  });

  bookings.push(booking);

}

console.log(`✅ Created ${bookings.length} bookings`);

const quotations = [];

for (const booking of bookings) {

  const quotation = await prisma.quotation.create({

    data: {

      bookingId: booking.id,

      vendorId: booking.vendorId,

      amount: faker.number.int({

        min: 30000,

        max: 300000

      }),

      message: faker.lorem.sentence(),

      validTill: faker.date.soon({

        days: 30

      }),

      status: "PENDING"

    }

  });

  quotations.push(quotation);

}

console.log(`✅ Created ${quotations.length} quotations`);

}

main()
  .then(async () => {
    console.log("🎉 Seed completed!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });