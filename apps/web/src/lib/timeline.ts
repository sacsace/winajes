export type ApiTimelineEvent = {
  id: string;
  year: number;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  order: number;
};
