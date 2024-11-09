export interface Facility {
    id: number;
    name: string;
    description: string;
    available_days: string;
    min_capacity: number;
    max_capacity: number;
    location: string;
    only_for_suny: boolean;
    image_source: string;
}
  