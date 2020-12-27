export interface Station {
  adresse: string;
  position?: google.maps.LatLng;
  cp: string;
  horaires: {
    ferme: boolean;
    fermeture: string;
    id: string;
    jour: string;
    ouverture: string;
  }[];
  id: string;
  latitude: number;
  longitude: number;
  prix:
    {
      id: string;
      maj: string;
      nom: string;
      valeur: string;
    }[];
  services: string[];
  ville: string;
  distance?: number;
}
