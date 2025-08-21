
import "./About.css";

export default function About() {
  return (
    <section className="about-section">
      <img
        src="https://lodgr.s3.us-east-2.amazonaws.com/PowerHaus+Logo.png"
        alt="PowerHaus Logo"
        className="about-logo"
      />
      <div className="accent-bar">
        <span className="barbell-icon">🏋️‍♂️</span>
      </div>
      <h2>About PowerHaus</h2>
      <p>
        At <strong>PowerHaus</strong>, we believe fitness is more than just a workout—it’s a lifestyle.
        Our mission is to empower every member to reach their full potential, whether you’re stepping
        into the gym for the first time or training for your next personal best.
      </p>
      <p>
        With state-of-the-art equipment, expert trainers, and a supportive community,{" "}
        <strong>PowerHaus</strong> is designed to help you build strength, endurance, and confidence.
        We combine innovative programs, dynamic classes, and personalized training plans to make sure
        every session counts.
      </p>
      <p>
        Join <strong>PowerHaus</strong> and experience a fitness environment that motivates, challenges,
        and transforms. Your goals are within reach—and we’re here to help you crush them.
      </p>
    </section>
  );
}
