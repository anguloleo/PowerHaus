import ImageCarousel from "../ImageCarousel";
import "./HomePage.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homepage">
      


      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h2>Strength Meets Community</h2>
          <p>
            Train smarter, push harder, and be part of the PowerHaus family.
            Your transformation starts here.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary"
            onClick= {() => alert("Coming Soon!")}>Join Now</button>
            <Link to="/classes/all">
            <button className="btn-secondary">View Classes</button>
            </Link>
          </div>
        </div>
        <div className="hero-carousel">
          <ImageCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h3>🏋️ Elite Equipment</h3>
          <p>Train with the best machines and free weights in the industry.</p>
        </div>
        <div className="feature">
          <h3>🤝 Expert Trainers</h3>
          <p>Get guidance from certified trainers who care about your goals.</p>
        </div>
        <div className="feature">
          <h3>💪 All Levels Welcome</h3>
          <p>From beginner to pro, we have programs to fit your journey.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>© {new Date().getFullYear()} PowerHaus Gym. All rights reserved.</p>
      </footer>
    </div>
  );
}
