export interface Station {
  id: number;
  lat: number;
  lng: number;
  adresse: string;
  region: string;
  departement: string;
  ville: string;
  code_departement: string;
  prix: {
    '@nom': string;
    '@id': string;
    '@maj': string;
    '@valeur': number;
  }[];
  horaires: {
    '@automate-24-24': string;
    jour: {
      '@id': string;
      '@nom': string;
      '@ferme': string;
    }[];
  };
}
