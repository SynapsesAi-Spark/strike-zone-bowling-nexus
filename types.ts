
import React from 'react';

export type Language = 'EN' | 'FR';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Badge {
  image: string;
  name: string;
  count: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
  colorClass: string;
}

export interface PricingPlan {
  id: 'free' | 'spare' | 'strike';
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  buttonLabel: string;
}

export type GameType = '5-pin' | '10-pin';
export type EntryMode = 'visual' | 'manual';

export interface Frame {
  balls: (number | 'X' | '/' | '-' | 'H' | 'A' | null)[];
  score: number | null;
  cumulativeScore: number | null;
}

export interface Player {
  id: string;
  name: string;
  frames: Frame[];
}