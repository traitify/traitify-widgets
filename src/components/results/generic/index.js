import useResults from "lib/hooks/use-results";

export default function Generic() {
  const results = useResults({surveyType: "generic"});
  console.log("Generic assessment result:", results);
  return (
    <div>
      <h1>Generic Report</h1>
      <p>This is a placeholder for a generic report. Please customize it as needed.</p>
    </div>
  );
}
