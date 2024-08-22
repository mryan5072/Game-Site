// components/SearchBar.tsx

const SearchBar: React.FC = () => {
    return (
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search"
          className="p-2 rounded bg-gray-200 w-64"
        />
      </div>
    );
  };
  
  export default SearchBar;
  