import { Questionnaire } from "../shared/domain/Questionnaire";
import { QuestionnaireResponse } from "../shared/domain/QuestionnaireResponse";

export const fetchQuestionnaire = async (
  id: string
): Promise<Questionnaire> => {
  const response = await fetch(`http://localhost:3000/questionnaire/${id}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseInJson = await response.json();
  return Questionnaire.fromFHIR(responseInJson.questionnaireInFhirFormat);
};

export const submitQuestionnaireResponse = async (
  questionnaireResponse: QuestionnaireResponse
): Promise<void> => {
  const response = await fetch(`http://localhost:3000/questionnaireResponse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      questionnaireId: 1,
      questionnaireResponse: questionnaireResponse.asFHIR(),
    }),
  });

  return response.json();
};
