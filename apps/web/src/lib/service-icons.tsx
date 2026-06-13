'use client';

import type { ComponentType, SVGProps } from 'react';
import {
  Droplets,
  Flame,
  PenTool,
  Server,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';

type ServiceIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const iconMap: Record<string, ServiceIcon> = {
  Wrench,
  Wind,
  Zap,
  Flame,
  Droplets,
  Server,
  PenTool,
};

export function getServiceIcon(name: string): ServiceIcon {
  return iconMap[name] ?? Wrench;
}
