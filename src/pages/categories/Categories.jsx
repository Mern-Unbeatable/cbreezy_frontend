import  { useState } from 'react';
import CategoriesHero from './components/CategoriesHero';
import CategoryGrid from './components/Categorygrid';

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <main>
      <CategoriesHero onSearch={handleSearch} />
      <CategoryGrid searchQuery={searchQuery} />
    </main>
  );
};

export default Categories;