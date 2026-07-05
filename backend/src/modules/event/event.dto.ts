export interface CreateEventDTO {
  title: string;
  eventType: string;
  eventDate: Date;

  city: string;
  state: string;
  country: string;

  guestCount: number;

  budget?: number;
  description?: string;
}