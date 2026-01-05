import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./ManageBooks.css";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      
      console.log("Books response:", res.data);
      
      // Handle different response formats
      let booksData;
      if (Array.isArray(res.data)) {
        booksData = res.data;
      } else if (res.data.data) {
        booksData = res.data.data;
      } else {
        booksData = [];
      }
      
      setBooks(booksData);
    } catch (err) {
      console.error("Error fetching books:", err);
      alert("Error fetching books: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await api.delete(`/books/${id}`);
      alert(res.data.message || "Book deleted successfully");
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Error deleting book: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Manage Books</h2>
        <button 
          onClick={() => navigate("/add-book")}
          className="btn-primary"
        >
          Add New Book
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading...</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No books found
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.category?.name || "N/A"}</td>
                  <td>${parseFloat(b.price).toFixed(2)}</td>
                  <td>{b.stock}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/edit-book/${b.id}`)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(b.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
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