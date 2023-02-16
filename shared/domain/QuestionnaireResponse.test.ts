import { QuestionnaireResponse } from "./QuestionnaireResponse";
import fhir from "fhir/r5";

describe("QuestionnaireResponse", () => {
  it("should construct from FHIR", () => {
    const partialFHIRQuestionnaireResponse: Partial<fhir.QuestionnaireResponse> =
      {
        item: [
          {
            linkId: "the-link-id",
            answer: [
              {
                valueBoolean: true,
              },
              {
                valueBoolean: false,
              },
            ],
          },
        ],
      };

    const questionnaire = QuestionnaireResponse.fromFHIR(
      partialFHIRQuestionnaireResponse as fhir.QuestionnaireResponse
    );

    expect(questionnaire.answers.length).toBe(1);
    expect(questionnaire.answers[0].linkId).toBe("the-link-id");
    expect(questionnaire.answers[0].value).toStrictEqual([true, false]);
  });

  it("should convert to FHIR", () => {
    // Given
    const partialFHIRQuestionnaireResponse: Partial<fhir.QuestionnaireResponse> =
      {
        item: [
          {
            linkId: "the-link-id",
            answer: [
              {
                valueBoolean: true,
              },
              {
                valueBoolean: false,
              },
            ],
          },
        ],
      };

    const questionnaire = QuestionnaireResponse.fromFHIR(
      partialFHIRQuestionnaireResponse as fhir.QuestionnaireResponse
    );

    // When
    const fhirQuestionnaireResponse = questionnaire.asFHIR();

    // Then
    expect(fhirQuestionnaireResponse.item).toBeDefined();
    expect(fhirQuestionnaireResponse.item?.length).toBe(1);
    expect(fhirQuestionnaireResponse.item?.[0].linkId).toBe("the-link-id");
    expect(fhirQuestionnaireResponse.item?.[0].answer).toBeDefined();
    expect(fhirQuestionnaireResponse.item?.[0].answer?.length).toBe(2);
    expect(fhirQuestionnaireResponse.item?.[0].answer?.[0].valueBoolean).toBe(
      true
    );
    expect(fhirQuestionnaireResponse.item?.[0].answer?.[1].valueBoolean).toBe(
      false
    );
  });
});
