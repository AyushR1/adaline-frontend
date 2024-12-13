import * as HeroIcons from '@heroicons/react/24/outline';

export const icons = Object.fromEntries(
  Object.entries(HeroIcons).map(([key, IconComponent]) => [
    key.toLowerCase().replace(/icon$/, ''), // Transform the key (optional)
    <IconComponent className="h-5 w-5" />,
  ])
);
