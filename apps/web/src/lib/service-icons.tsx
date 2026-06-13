'use client';

import {
  Droplets,
  Flame,
  PenTool,
  Server,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Wind,
  Zap,
  Flame,
  Droplets,
  Server,
  PenTool,
};

export function getServiceIcon(name: string): LucideIcon {
  return iconMap[name] ?? Wrench;
}
