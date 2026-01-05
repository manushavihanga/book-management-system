import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Home.css";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("Component rendered - Books:", books);
  console.log("Component rendered - Categories:", categories);

  // Fetch books categoryId changes
  useEffect(() => {
    fetchBooks();
  }, [categoryId]);

  // Fetch categories 
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = categoryId ? { category_id: categoryId } : {};
      
      console.log("Fetching books with params:", params);
      const res = await api.get("/books", { params });
      
      console.log("Full response:", res.data);
      
      // Backend returns array 
      let booksData;
      if (Array.isArray(res.data)) {
        booksData = res.data;
      } else if (res.data.data) {
        booksData = res.data.data;
      } else {
        booksData = [];
      }
      
      console.log("Books data:", booksData);
      setBooks(booksData);
    } catch (err) {
      console.error("Error fetching books:", err);
      console.error("Error response:", err.response);
      alert("Error fetching books: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/book-categories");
      console.log("Categories response:", res.data);
      
    
      let categoryData;
      if (Array.isArray(res.data)) {
        categoryData = res.data;
      } else if (res.data.data) {
        categoryData = res.data.data;
      } else {
        categoryData = [];
      }
      
      console.log("Categories data:", categoryData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      console.error("Error response:", err.response);
      alert("Error fetching categories");
    }
  };

  const borrowBook = async (id) => {
    try {
      const response = await api.post("/borrow", {
        book_id: id,
      });
      
     
      await fetchBooks();
      
      const message = response.data?.message || "Book borrowed successfully";
      alert(message);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error borrowing book";
      alert(errorMsg);
    }
  };

  return (
    <div className="page">
      <h2>Available Books</h2>

      <div className="filter-section">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No books found
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.category?.name || "N/A"}</td>
                  <td>${b.price}</td>
                  <td>{b.stock}</td>
                  <td>
                    {b.stock === 0 ? (
                      <span className="out-of-stock">Out of stock</span>
                    ) : (
                      <button
                        onClick={() => borrowBook(b.id)}
                        className="btn-borrow"
                      >
                        Borrow
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}