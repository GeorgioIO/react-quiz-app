import headerImage from "../../assets/quiz-logo.png";

export default function Header() {
  return (
    <header>
      <img src={headerImage} alt="Quiz book with a pen" />
      <h1>REACT QUIZ</h1>
    </header>
  );
}
