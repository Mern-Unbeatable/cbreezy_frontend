import SEO from "../../components/SEO";
import  { useState } from 'react';
import CategoriesHero from './components/CategoriesHero';
import CategoryGrid from './components/Categorygrid';

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <SEO title="Best Weekend Side Hustles & Flexible Side Jobs" description="Browse categories to find the best weekend side hustles, flexible side gigs, and local ways to make money near you." />
      <CategoriesHero onSearch={handleSearch} />
      <CategoryGrid searchQuery={searchQuery} />
    </div>
  );
};

export default Categories;