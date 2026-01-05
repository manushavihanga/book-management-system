import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import "./AddEditBook.css";

export default function AddEditBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!bookId;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    book_category_id: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchBook();
    }
  }, [bookId]);

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
      
      setCategories(categoryData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("Error fetching categories: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${bookId}`);
      console.log("Book details response:", res.data);
      
     
      const bookData = res.data.data || res.data;
      
      setFormData({
        title: bookData.title || "",
        author: bookData.author || "",
        price: bookData.price || "",
        stock: bookData.stock || "",
        book_category_id: bookData.book_category_id || ""
      });
    } catch (err) {
      console.error("Error fetching book details:", err);
      alert("Error fetching book details: " + (err.response?.data?.message || err.message));
      navigate("/manage-books");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const res = await api.put(`/books/${bookId}`, formData);
        alert(res.data.message || "Book updated successfully");
      } else {
        const res = await api.post("/books", formData);
        alert(res.data.message || "Book created successfully");
      }
      navigate("/manage-books");
    } catch (err) {
      console.error("Error saving book:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error saving book";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>{isEdit ? "Edit Book" : "Add New Book"}</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength="2"
            placeholder="Enter book title"
          />
        </div>

        <div className="form-group">
          <label>Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            minLength="2"
            placeholder="Enter author name"
          />
        </div>

        <div className="form-group">
          <label>Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="book_category_id"
            value={formData.book_category_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : (isEdit ? "Update Book" : "Add Book")}
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/manage-books")}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}