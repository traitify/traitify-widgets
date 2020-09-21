import toArgs from "../to-args";
import toQuery from "../to-query";

export default function guideQuery({fields: _fields, params}) {
  const fields = _fields || [
    {
      competencies: [
        "id", "name", "introduction", "order",
        {
          questionSequences: [
            "id", "name", "personality_type_id",
            {questions: ["id", "text", "adaptability", "order", "purpose"]}
          ]
        }
      ]
    }
  ];

  return `{ guide(${toArgs(params)}) { ${toQuery(fields)} }}`;
}
