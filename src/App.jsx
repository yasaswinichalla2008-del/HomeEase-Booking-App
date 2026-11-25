
import { useState } from "react";
import "./App.css";

// SERVICES
const services = [
  { id: 1, name: "Plumbing", icon: "🔧", description: "Fix leaks, taps and pipes", price: "₹299", category: "Repair" },
  { id: 2, name: "Electrical", icon: "⚡", description: "Wiring, fans and repairs", price: "₹399", category: "Repair" },
  { id: 3, name: "Home Cleaning", icon: "🧹", description: "Make your home spotless", price: "₹499", category: "Cleaning" },
  { id: 4, name: "AC Repair", icon: "❄️", description: "AC service and maintenance", price: "₹599", category: "Repair" },
  { id: 5, name: "Painting", icon: "🎨", description: "Give your walls a fresh look", price: "₹999", category: "Other" },
  { id: 6, name: "Carpentry", icon: "🪚", description: "Furniture and woodwork", price: "₹399", category: "Other" },
];

// SERVICE PROVIDERS
const providers = [
  { id: 1, name: "Rahul Kumar", service: "Plumbing", experience: "5 years", rating: "4.9", icon: "👨‍🔧" },
  { id: 2, name: "Arjun Reddy", service: "Electrical", experience: "6 years", rating: "4.8", icon: "👨‍🔧" },
  { id: 3, name: "Priya Sharma", service: "Home Cleaning", experience: "4 years", rating: "4.9", icon: "👩‍🔧" },
  { id: 4, name: "Kiran Kumar", service: "AC Repair", experience: "7 years", rating: "4.7", icon: "👨‍🔧" }
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [selectedPaymentBooking, setSelectedPaymentBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // LOGIN AND REGISTER STATES
  const [authMode, setAuthMode] = useState(null);
  const [authError, setAuthError] = useState("");

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("homeeaseCurrentUser") || "null");
    } catch {
      return null;
    }
  });

  // GET REGISTERED USERS
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem("homeeaseUsers") || "[]");
    } catch {
      return [];
    }
  }

  // OPEN LOGIN OR REGISTER
  function openAuth(mode) {
    setAuthMode(mode);
    setAuthError("");
    setAuthForm({ name: "", email: "", password: "" });
  }

  // REGISTER
  function handleRegister(e) {
    e.preventDefault();

    const users = getUsers();
    const email = authForm.email.trim().toLowerCase();

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      setAuthError("This email is already registered. Please login.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: authForm.name.trim(),
      email: email,
      password: authForm.password
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem(
      "homeeaseUsers",
      JSON.stringify(updatedUsers)
    );

    setCurrentUser(newUser);

    localStorage.setItem(
      "homeeaseCurrentUser",
      JSON.stringify(newUser)
    );

    setAuthMode(null);
    setAuthError("");
    setMessage("🎉 Registration successful! Welcome to HomeEase.");
  }

  // LOGIN
  function handleLogin(e) {
    e.preventDefault();

    const users = getUsers();
    const email = authForm.email.trim().toLowerCase();

    const foundUser = users.find(
      (user) =>
        user.email === email &&
        user.password === authForm.password
    );

    if (!foundUser) {
      setAuthError("Invalid email or password. Please try again.");
      return;
    }

    setCurrentUser(foundUser);

    localStorage.setItem(
      "homeeaseCurrentUser",
      JSON.stringify(foundUser)
    );

    setAuthMode(null);
    setAuthError("");
    setMessage(`Welcome back, ${foundUser.name}! ❤️`);
  }

  // LOGOUT
  function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem("homeeaseCurrentUser");
    setMessage("You have logged out successfully.");
  }

  // BOOKINGS
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("homeeaseBookings") || "[]");
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "09:00 AM",
    address: "",
    provider: ""
  });

  // FILTER SERVICES
  const filteredServices = services.filter((service) => {
    return (
      service.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || service.category === category)
    );
  });

  // OPEN BOOKING FORM
  function bookService(service) {
    setSelectedService(service);
    setMessage("");

    setForm({
      name: currentUser?.name || "",
      date: "",
      time: "09:00 AM",
      address: "",
      provider: ""
    });
  }

  // CONFIRM BOOKING
  function confirmBooking(e) {
    e.preventDefault();

    if (!form.provider) {
      alert("Please select a professional.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      service: selectedService.name,
      provider: form.provider,
      price: selectedService.price,
      customer: form.name,
      date: form.date,
      time: form.time,
      address: form.address,
      status: "Confirmed",
      paymentStatus: "Pending",
      paymentMethod: ""
    };

    const updatedBookings = [...bookings, newBooking];

    setBookings(updatedBookings);

    localStorage.setItem(
      "homeeaseBookings",
      JSON.stringify(updatedBookings)
    );

    setSelectedService(null);
    setSelectedPaymentBooking(newBooking);
    setPaymentMethod("UPI");

    setForm({
      name: "",
      date: "",
      time: "09:00 AM",
      address: "",
      provider: ""
    });

    setMessage("🎉 Your booking has been confirmed successfully!");
  }

  // CANCEL BOOKING
  function cancelBooking(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    const updatedBookings = bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status: "Cancelled" }
        : booking
    );

    setBookings(updatedBookings);

    localStorage.setItem(
      "homeeaseBookings",
      JSON.stringify(updatedBookings)
    );
  }

  // DEMO PAYMENT
  function processPayment() {
    const updatedBookings = bookings.map((booking) =>
      booking.id === selectedPaymentBooking.id
        ? {
            ...booking,
            paymentMethod: paymentMethod,
            paymentStatus:
              paymentMethod === "Cash on Delivery"
                ? "Cash on Delivery"
                : "Paid (Demo)"
          }
        : booking
    );

    setBookings(updatedBookings);

    localStorage.setItem(
      "homeeaseBookings",
      JSON.stringify(updatedBookings)
    );

    setSelectedPaymentBooking(null);

    setMessage(
      paymentMethod === "Cash on Delivery"
        ? "🎉 Booking confirmed! Pay after the service."
        : "🎉 Demo payment successful!"
    );
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="#home" className="logo">
          🏠 Home<span>Ease</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#professionals">Professionals</a>
          <a href="#bookings">My Bookings</a>
          <a href="#about">About</a>
        </div>

        <div className="auth-nav">
          {currentUser ? (
            <>
              <span className="welcome-user">
                Hi, {currentUser.name}
              </span>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={() => openAuth("login")}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tagline">✨ YOUR HOME, OUR CARE</span>

          <h1>
            Home services made
            <span> simple & reliable.</span>
          </h1>

          <p>
            Find trusted professionals for all your home needs.
            Book quality services at affordable prices.
          </p>

          <a href="#services" className="primary-btn">
            Explore Services →
          </a>

          <div className="trust-info">
            ⭐ 4.8/5 Customer Rating | Trusted Home Professionals
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-icon">🏡</div>

          <div className="floating-card">
            <span>✓</span> Trusted Professionals
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="search-section">
        <h2>What service do you need?</h2>

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search plumbing, cleaning, electrical..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <a href="#services" className="search-btn">
            Search
          </a>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="section-heading">
          <span className="small-heading">OUR SERVICES</span>
          <h2>Explore Our Services</h2>
          <p>Everything your home needs, all in one place.</p>
        </div>

        <div className="filters">
          {["All", "Repair", "Cleaning", "Other"].map((item) => (
            <button
              key={item}
              className={category === item ? "filter active" : "filter"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="service-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="service-icon">{service.icon}</div>

                <h3>{service.name}</h3>
                <p>{service.description}</p>

                <div className="card-bottom">
                  <strong>From {service.price}</strong>

                  <button onClick={() => bookService(service)}>
                    Book Now →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">No services found.</p>
          )}
        </div>

        {message && (
          <div className="message">
            {message}
            <button onClick={() => setMessage("")}>✕</button>
          </div>
        )}
      </section>

      {/* PROFESSIONALS */}
      <section className="services-section" id="professionals">
        <div className="section-heading">
          <span className="small-heading">OUR EXPERTS</span>
          <h2>Meet Our Professionals</h2>
          <p>Choose skilled professionals for your home.</p>
        </div>

        <div className="service-grid">
          {providers.map((provider) => (
            <div className="service-card" key={provider.id}>
              <div className="service-icon">{provider.icon}</div>
              <h3>{provider.name}</h3>
              <p>{provider.service}</p>
              <p>Experience: {provider.experience}</p>
              <p>⭐ {provider.rating} / 5</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING FORM */}
      {selectedService && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <button
              className="close-btn"
              onClick={() => setSelectedService(null)}
            >
              ✕
            </button>

            <span className="small-heading">BOOK YOUR SERVICE</span>

            <h2>
              {selectedService.icon} {selectedService.name}
            </h2>

            <p>Starting price: {selectedService.price}</p>

            <form onSubmit={confirmBooking}>
              <label>Choose Your Professional</label>

              <select
                value={form.provider}
                onChange={(e) =>
                  setForm({ ...form, provider: e.target.value })
                }
                required
              >
                <option value="">Select a professional</option>

                {providers
                  .filter((p) => p.service === selectedService.name)
                  .map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} - ⭐ {p.rating} ({p.experience})
                    </option>
                  ))}
              </select>

              <label>Your Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <label>Appointment Date</label>

              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                required
              />

              <label>Choose Time</label>

              <select
                value={form.time}
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
              >
                <option>09:00 AM</option>
                <option>11:00 AM</option>
                <option>01:00 PM</option>
                <option>03:00 PM</option>
                <option>05:00 PM</option>
              </select>

              <label>Service Address</label>

              <textarea
                placeholder="Enter your complete home address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                required
              />

              <button className="confirm-btn" type="submit">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT PAGE */}
      {selectedPaymentBooking && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <button
              className="close-btn"
              onClick={() => setSelectedPaymentBooking(null)}
            >
              ✕
            </button>

            <span className="small-heading">HOME EASE CHECKOUT</span>

            <h2>💳 Complete Your Payment</h2>

            <div className="payment-details">
              <h3>{selectedPaymentBooking.service}</h3>
              <p>Professional: {selectedPaymentBooking.provider}</p>
              <p>Appointment: {selectedPaymentBooking.date}</p>
              <h2>Total: {selectedPaymentBooking.price}</h2>
            </div>

            <label>Choose Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="UPI">UPI</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>

            <p className="payment-note">
              Demo checkout only. No real money will be transferred.
            </p>

            <button className="confirm-btn" onClick={processPayment}>
              {paymentMethod === "Cash on Delivery"
                ? "Confirm Booking"
                : "Pay Now"}
            </button>

            <button
              className="cancel-btn"
              onClick={() => setSelectedPaymentBooking(null)}
            >
              Pay Later
            </button>
          </div>
        </div>
      )}

      {/* LOGIN AND REGISTER POPUP */}
      {authMode && (
        <div className="modal-overlay">
          <div className="booking-modal auth-modal">
            <button
              className="close-btn"
              onClick={() => setAuthMode(null)}
            >
              ✕
            </button>

            <div className="auth-header">
              <div className="service-icon">🏠</div>
              <h2>{authMode === "login" ? "Welcome Back!" : "Create Account"}</h2>
              <p>
                {authMode === "login"
                  ? "Login to your HomeEase account"
                  : "Register to get started with HomeEase"}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => openAuth("login")}
              >
                Login
              </button>

              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => openAuth("register")}
              >
                Register
              </button>
            </div>

            <form
              onSubmit={
                authMode === "login"
                  ? handleLogin
                  : handleRegister
              }
            >
              {authMode === "register" && (
                <>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={authForm.name}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, name: e.target.value })
                    }
                    required
                  />
                </>
              )}

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                minLength={6}
                required
              />

              {authError && (
                <p className="auth-error">{authError}</p>
              )}

              <button className="confirm-btn" type="submit">
                {authMode === "login" ? "Login" : "Create Account"}
              </button>
            </form>

            <p className="auth-switch">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() =>
                  openAuth(authMode === "login" ? "register" : "login")
                }
              >
                {authMode === "login" ? " Register" : " Login"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* MY BOOKINGS */}
      <section className="bookings-section" id="bookings">
        <span className="small-heading">YOUR APPOINTMENTS</span>
        <h2>My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="no-bookings">
            You haven't booked any services yet.
          </p>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <div>
                  <h3>{booking.service}</h3>
                  <p>Customer: {booking.customer}</p>
                  <p>Professional: {booking.provider}</p>
                  <p>Date: {booking.date} | Time: {booking.time}</p>
                  <p>Address: {booking.address}</p>
                  <strong>{booking.price}</strong>
                  <p>Payment Method: {booking.paymentMethod || "Not selected"}</p>
                  <p>Payment Status: {booking.paymentStatus || "Not paid"}</p>
                </div>

                <div>
                  <span
                    className={
                      booking.status === "Cancelled"
                        ? "status cancelled"
                        : "status"
                    }
                  >
                    {booking.status}
                  </span>

                  {booking.status === "Confirmed" && (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section" id="about">
        <span className="small-heading">WHY HOME EASE?</span>
        <h2>Your comfort is our priority.</h2>

        <div className="why-grid">
          <div>
            🛡️
            <h3>Trusted Experts</h3>
            <p>Reliable service professionals.</p>
          </div>

          <div>
            💰
            <h3>Affordable Prices</h3>
            <p>Quality services at fair prices.</p>
          </div>

          <div>
            ⏰
            <h3>Easy Booking</h3>
            <p>Book services in a few steps.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <h2>🏠 HomeEase</h2>
        <p>Your Home. Our Care.</p>
        <p>© 2026 HomeEase. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;
