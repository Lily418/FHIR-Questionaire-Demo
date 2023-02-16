import { useEffect, useState } from "react";
import {
  fetchQuestionnaire,
  submitQuestionnaireResponse,
} from "../services/questionnaire";
import { Questionnaire } from "../shared/domain/Questionnaire";
import { QuestionnaireResponse } from "../shared/domain/QuestionnaireResponse";
import { QuestionInputComponent } from "./Question";
import { Button, Card, Spacer } from "@nextui-org/react";
import { QuestionCard } from "./QuestionCard";

export const QuestionnaireComponent: React.FC = () => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null
  );

  const [answers, setAnswers] = useState<Record<string, boolean[] | string[]>>(
    {}
  );

  useEffect(() => {
    (async () => {
      // We hardcode the known id of the questionnaire for now
      const questionnaire = await fetchQuestionnaire("1");
      setQuestionnaire(questionnaire);
      const linkIds = questionnaire.questions.map(
        (question) => question.linkId
      );
      setAnswers(
        Object.assign({}, ...linkIds.map((linkId) => ({ [linkId]: [] })))
      );
    })();
  }, []);

  const submit = async () => {
    const questionnaireResponse = new QuestionnaireResponse(
      Object.keys(answers).map((linkId) => {
        return {
          linkId,
          value: answers[linkId],
        };
      })
    );

    const response = await submitQuestionnaireResponse(questionnaireResponse);
    alert(`Submitted: ${JSON.stringify(response)}`);
  };

  return (
    <div style={{ margin: "40px" }}>
      <h1>{questionnaire?.title}</h1>
      {questionnaire?.questions.map((question) => (
        <QuestionCard>
          <QuestionInputComponent
            question={question}
            onChange={(values) => {
              setAnswers({
                ...answers,
                [question.linkId]: values,
              });
            }}
          />
        </QuestionCard>
      ))}

      <Button
        onClick={(e) => {
          submit();
        }}
        css={{ float: "right" }}
      >
        Submit
      </Button>
      <Spacer y={2} />
    </div>
  );
};
