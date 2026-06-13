export type ClientCategory = 'brand' | 'entity';

export type ClientInput = {
  name: string;
  logo?: string;
  category: ClientCategory;
  order?: number;
};
