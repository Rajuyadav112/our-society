export default function Button({ text, onClick }) {
  return (
    <button className="auth-button" onClick={onClick}>
      {text}
    </button>
  );
}
