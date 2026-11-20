import type { Role } from "@/lib/mock/store";

export interface GuideStep {
  text: string;
  mobile?: string;
  at: string;
  href?: string;
}

export interface GuideCase {
  id: string;
  name: string;
  about: string;
  role: Role;
  sheet?: number | number[];
  seed: () => void;
  steps: GuideStep[];
}

export interface GuideScenario {
  key: string;
  code: string;
  title: string;
  who: string;
  about: string;
  cases: GuideCase[];
}
