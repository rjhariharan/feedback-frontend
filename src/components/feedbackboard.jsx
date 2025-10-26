import { useState, useEffect } from "react";
import { feedbackAPI, authAPI } from "../api";

export default function FeedbackBoard({ onLogout }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Load all feedbacks
  async function fetchFeedbacks() {
    try {
      setLoading(true);
      const data = await feedbackAPI.getAll();
      setFeedbacks(data);
    } catch (err) {
      console.error("❌ Error fetching feedbacks:", err);
      if (err.message.includes("Unauthorized")) {
        setError("Session expired. Please log in again.");
        setTimeout(() => onLogout(), 1500);
      } else {
        setError("Failed to load feedbacks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ✅ Add feedback
  async function addFeedback() {
    if (!title || !description) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await feedbackAPI.create({ title, description, status });
      setTitle("");
      setDescription("");
      setStatus("pending");
      setSuccess("Feedback submitted successfully!");
      fetchFeedbacks();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Upvote feedback
  async function handleUpvote(id) {
    try {
      await feedbackAPI.upvote(id);
      fetchFeedbacks();
    } catch (err) {
      console.error("Error upvoting feedback:", err);
      setError("Failed to upvote feedback");
    }
  }

  // ✅ Update feedback status (for admin)
  async function handleStatusChange(id, newStatus) {
    try {
      await feedbackAPI.updateStatus(id, newStatus);
      fetchFeedbacks();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    }
  }

  // ✅ Delete feedback (only owner or admin)
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await feedbackAPI.delete(id);
      setSuccess("Feedback deleted successfully!");
      fetchFeedbacks();
    } catch (err) {
      console.error("Error deleting feedback:", err);
      setError("Failed to delete feedback");
    }
  }

  // ✅ Promote to admin (testing)
  async function promoteToAdmin() {
    try {
      setLoading(true);
      await authAPI.promoteToAdmin(currentUser._id);
      const updatedUser = { ...currentUser, role: "admin" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Promoted to admin!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError("Failed to promote to admin");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // ✅ Color code for status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "in-progress":
        return "#17a2b8";
      case "completed":
        return "#28a745";
      case "closed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  return (
    <div style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "#f8f9fa",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "30px",
        padding: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "15px",
        color: "white",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          margin: "0",
          fontSize: "2.5rem",
          fontWeight: "bold",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}>
          💬 Feedback Board
        </h1>
        <p style={{
          margin: "10px 0 0 0",
          fontSize: "1.1rem",
          opacity: "0.9"
        }}>
          Share your thoughts and help us improve
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
          color: "white",
          padding: "15px 20px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "none",
          boxShadow: "0 4px 12px rgba(255,107,107,0.3)",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{
          background: "linear-gradient(135deg, #51cf66, #40c057)",
          color: "white",
          padding: "15px 20px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "none",
          boxShadow: "0 4px 12px rgba(81,207,102,0.3)",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          ✅ {success}
        </div>
      )}

      {/* Add Feedback Form */}
      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "30px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e9ecef"
      }}>
        <h3 style={{
          margin: "0 0 20px 0",
          color: "#495057",
          fontSize: "1.3rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          📝 Submit New Feedback
        </h3>

        <div style={{ display: "grid", gap: "15px" }}>
          <input
            placeholder="What would you like to suggest?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "15px",
              transition: "all 0.3s ease",
              background: "#f8f9fa",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
          />

          <textarea
            placeholder="Please provide detailed description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "12px 15px",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "15px",
              resize: "vertical",
              transition: "all 0.3s ease",
              background: "#f8f9fa",
              fontFamily: "inherit",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
          />

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                background: "white",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              <option value="pending">🔄 Pending</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
              <option value="closed">🔒 Closed</option>
            </select>

            <button
              onClick={addFeedback}
              disabled={loading}
              style={{
                background: loading ? "#6c757d" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: loading ? "none" : "0 4px 15px rgba(102,126,234,0.3)"
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
              onMouseOut={(e) => !loading && (e.target.style.transform = "translateY(0)")}
            >
              {loading ? "⏳ Submitting..." : "🚀 Submit Feedback"}
            </button>
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e9ecef"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "2px solid #f8f9fa",
          paddingBottom: "15px"
        }}>
          <h3 style={{
            margin: "0",
            color: "#495057",
            fontSize: "1.4rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            💬 All Feedback ({feedbacks.length})
          </h3>

          {loading && (
            <div style={{
              color: "#667eea",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                border: "2px solid #e9ecef",
                borderTop: "2px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
              Loading...
            </div>
          )}
        </div>

        {feedbacks.length === 0 && !loading && (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#6c757d",
            background: "#f8f9fa",
            borderRadius: "10px",
            border: "2px dashed #e9ecef"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>💭</div>
            <p style={{ fontSize: "1.1rem", margin: "0" }}>
              No feedback yet. Be the first to share your thoughts!
            </p>
          </div>
        )}

        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            style={{
              background: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "15px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ marginBottom: "15px" }}>
              <h4 style={{
                margin: "0 0 10px 0",
                color: "#2c3e50",
                fontSize: "1.2rem",
                fontWeight: "600"
              }}>
                {fb.title}
              </h4>
              <p style={{
                margin: "0",
                color: "#555",
                lineHeight: "1.5",
                fontSize: "15px"
              }}>
                {fb.description}
              </p>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span
                  style={{
                    background: getStatusColor(fb.status),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                  }}
                >
                  {fb.status?.toUpperCase()}
                </span>

                {/* Admin status change */}
                {currentUser.role === "admin" && (
                  <select
                    value={fb.status}
                    onChange={(e) => handleStatusChange(fb._id, e.target.value)}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      background: "white",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "#495057"
                    }}
                  >
                    <option value="pending">🔄 Pending</option>
                    <option value="in-progress">⚡ In Progress</option>
                    <option value="completed">✅ Completed</option>
                    <option value="closed">🔒 Closed</option>
                  </select>
                )}
              </div>

              <div style={{
                fontSize: "13px",
                color: "#6c757d",
                display: "flex",
                alignItems: "center",
                gap: "15px"
              }}>
                <span>👤 {fb.user?.username || "Anonymous"}</span>
                <span>📅 {new Date(fb.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #e9ecef",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <button
                onClick={() => handleUpvote(fb._id)}
                style={{
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  boxShadow: "0 2px 8px rgba(40,167,69,0.3)"
                }}
                onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              >
                👍 {fb.upvotes || 0}
              </button>

              {(fb.user?._id === currentUser._id || currentUser.role === "admin") && (
                <button
                  onClick={() => handleDelete(fb._id)}
                  style={{
                    background: "linear-gradient(135deg, #dc3545, #c82333)",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    boxShadow: "0 2px 8px rgba(220,53,69,0.3)"
                  }}
                  onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* User Info & Actions */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "30px",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e9ecef"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#495057"
          }}>
            <span style={{ fontSize: "1.1rem" }}>Current Role:</span>
            <span style={{
              background: currentUser.role === "admin" ? "#28a745" : "#ffc107",
              color: "white",
              padding: "4px 12px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase"
            }}>
              {currentUser.role || "user"}
            </span>
          </div>

          {currentUser.role !== "admin" && (
            <button
              onClick={promoteToAdmin}
              style={{
                background: "linear-gradient(135deg, #ffc107, #fd7e14)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "25px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(255,193,7,0.3)"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              {loading ? "⏳ Promoting..." : "👑 Promote to Admin"}
            </button>
          )}

          <button
            onClick={onLogout}
            style={{
              background: "linear-gradient(135deg, #dc3545, #c82333)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(220,53,69,0.3)"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Loading Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
