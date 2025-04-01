import { IconName } from '@/lib/db';
import { Tag, Check, Star, Flag, Bookmark, Heart, Bell, AlertCircle } from 'lucide-react';
import { JSX } from 'react';

/**
 * Helper function to render the appropriate icon component
 * @param iconName - Name of the icon to render
 * @param className - Optional CSS class name for styling
 * @returns JSX element with the appropriate icon
 */
export const Icon = ({
  iconName,
  className,
}: {
  iconName: IconName;
  className?: string;
}): JSX.Element => {
  switch (iconName) {
    case 'tag':
      return <Tag className={className} />;
    case 'check':
      return <Check className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'flag':
      return <Flag className={className} />;
    case 'bookmark':
      return <Bookmark className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'bell':
      return <Bell className={className} />;
    case 'alertCircle':
      return <AlertCircle className={className} />;
    default:
      return <Tag className={className} />;
  }
};
