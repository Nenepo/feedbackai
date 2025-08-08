import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1>Cracked Feedback</h1>
      <p>Get roasted or praised by AI personas</p>

      <div>
        <p>Paste your pitch, text, or anything you want to get feedback on</p>
        <textarea />
        <select>
          <option value="default">Select a persona</option>
          <option value="gen-z">Gen Z</option>
          <option value="investor">Investor</option>
          <option value="bestie">Bestie</option>
          <option value="auntie">Auntie</option>
        </select>
        <button>Get Feedback</button>
      </div>
      <div>
        <p>Feedback</p>
      </div>
    </>
  );
}
