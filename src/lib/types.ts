export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  trekTime?: string | null;
  driveTime?: string | null;
  accommodation?: string | null;
  elevation?: string | null;
  distance?: string | null;
  meals?: string | null;
  overnight?: string | null;
}
