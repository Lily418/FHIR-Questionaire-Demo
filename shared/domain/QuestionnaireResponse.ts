import fhir from "fhir/r5";

type Answer = {
  linkId: string;
  value: (boolean | string)[];
};

export class QuestionnaireResponse {
  private _answers: Answer[];

  constructor(answers: Answer[]) {
    this._answers = answers;
  }

  static fromFHIR(
    fhirQuestionnaireResponse: fhir.QuestionnaireResponse
  ): QuestionnaireResponse {
    if (!fhirQuestionnaireResponse.item) {
      throw new Error("QuestionnaireResponse does not have any items");
    }

    const answers = fhirQuestionnaireResponse.item?.map((item) => {
      const values = item.answer
        ? item.answer.map((answer) => {
            return answer.valueBoolean ?? (answer.valueString as string);
          })
        : [];

      return {
        linkId: item.linkId,
        value: values,
      };
    });

    return new QuestionnaireResponse(answers);
  }

  asFHIR(): fhir.QuestionnaireResponse {
    // Using these partials here for the purpose of a demo, in a real app we would want to complete these types
    const partialQuestionnaireResponse: Partial<fhir.QuestionnaireResponse> = {
      resourceType: "QuestionnaireResponse",
      item: this._answers.map((answer) => ({
        linkId: answer.linkId,
        answer: answer.value.map((value) => ({
          valueBoolean: value as boolean,
          valueString: value as string,
        })),
      })),
    };

    return partialQuestionnaireResponse as fhir.QuestionnaireResponse;
  }

  get answers(): Answer[] {
    return this._answers;
  }
}
