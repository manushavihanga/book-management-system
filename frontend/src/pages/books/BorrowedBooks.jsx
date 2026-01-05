import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./BorrowedBooks.css";

export default function BorrowedBooks() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/my-borrows");
      
      console.log("Borrowed books response:", res.data);
      
     
      let recordsData;
      if (Array.isArray(res.data)) {
        recordsData = res.data;
      } else if (res.data.data) {
        recordsData = res.data.data;
      } else {
        recordsData = [];
      }
      
      setRecords(recordsData);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      alert("Error fetching borrowed books: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (recordId) => {
    if (!window.confirm("Are you sure you want to return this book?")) return;

    try {
      const res = await api.post(`/return/${recordId}`);
      alert(res.data.message || "Book returned successfully");
      fetchBorrowedBooks();
    } catch (err) {
      console.error("Error returning book:", err);
      alert(err.response?.data?.message || "Error returning book");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const getStatus = (record) => {
    return record.returned_at ? "returned" : "borrowed";
  };

  return (
    <div className="page">
      <h2>My Borrowed Books</h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading...</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Borrowed At</th>
              <th>Returned At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No borrowed books
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const status = getStatus(r);
                return (
                  <tr key={r.id}>
                    <td>{r.book?.title || "N/A"}</td>
                    <td>{r.book?.author || "N/A"}</td>
                    <td>{formatDate(r.borrowed_at)}</td>
                    <td>{formatDate(r.returned_at)}</td>
                    <td>
                      <span className={`status status-${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {!r.returned_at ? (
                        <button
                          onClick={() => returnBook(r.id)}
                          className="btn-return"
                        >
                          Return
                        </button>
                      ) : (
                        <span style={{ color: "#27ae60" }}>Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}