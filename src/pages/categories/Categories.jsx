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
      <CategoriesHero onSearch={handleSearch} />
      <CategoryGrid searchQuery={searchQuery} />
    </div>
  );
};

export default Categories;