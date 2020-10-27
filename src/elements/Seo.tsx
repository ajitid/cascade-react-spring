import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
}

/**
 * Needs to be included in every page to set tab title, and perform other SEO
 * related operations
 */
const Seo: React.FC<SeoProps> = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} | Anim` : 'Anim';
  }, [title]);

  return null;
};

export default Seo;
