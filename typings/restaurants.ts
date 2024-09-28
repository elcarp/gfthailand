interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Restaurant {
  name: string;
  neighborhood: string;
  tags: string[];
  address: string;
  coordinates: Coordinates;
  id?: string; // Optional as it's not present in all restaurant objects
}

interface RestaurantData {
  key: string;
  type: string;
  value: Restaurant;
}

interface RestaurantListProps {
  success: boolean;
  data: RestaurantData[];
}

// Example component props
interface RestaurantComponentProps {
  restaurants: RestaurantListProps;
}

export type {
  RestaurantComponentProps
}
