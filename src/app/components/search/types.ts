export interface SearchFormData {
  [key: string]: string;
  keyword: string;
  country: string;
  city: string;
  experience: string;
  location: string; // required to satisfy index signature; callers can pass '' when unknown
}


