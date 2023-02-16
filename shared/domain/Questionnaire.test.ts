import { Questionnaire } from "./Questionnaire";
import { QuestionnaireResponse } from "./QuestionnaireResponse";
import fhir from "fhir/r5";

describe("Questionnaire", () => {
  it("should construct from FHIR", () => {
    const partialFHIRQuestionnaire: Partial<fhir.Questionnaire> = {
      id: "the-id",
      title: "the-title",
      description: "the-description",
      item: [
        {
          linkId: "the-link-id",
          type: "boolean",
        },
      ],
    };

    const questionnaire = Questionnaire.fromFHIR(
      partialFHIRQuestionnaire as fhir.Questionnaire
    );

    expect(questionnaire.id).toBe("the-id");
    expect(questionnaire.title).toBe("the-title");
    expect(questionnaire.description).toBe("the-description");
    expect(questionnaire.questions.length).toBe(1);
    expect(questionnaire.questions[0].linkId).toBe("the-link-id");
    expect(questionnaire.questions[0].type).toBe("boolean");
  });

  describe("isQuestionnaireResponseValid", () => {
    it("should return false if the questionnaire response is invalid", () => {
      // Given
      const partialFHIRQuestionnaire: Partial<fhir.Questionnaire> = {
        id: "the-id",
        title: "the-title",
        description: "the-description",
        item: [
          {
            repeats: true,
            linkId: "the-link-id",
            type: "boolean",
          },
        ],
      };

      const partialFHIRQuestionnaireResponse: Partial<fhir.QuestionnaireResponse> =
        {
          item: [
            {
              linkId: "the-link-id",
              answer: [
                {
                  valueBoolean: false,
                },
                {
                  valueString: "not a boolean",
                },
              ],
            },
          ],
        };

      const questionnaire = Questionnaire.fromFHIR(
        partialFHIRQuestionnaire as fhir.Questionnaire
      );

      const questionnaireResponse = QuestionnaireResponse.fromFHIR(
        partialFHIRQuestionnaireResponse as fhir.QuestionnaireResponse
      );

      // When
      const isValid = questionnaire.isQuestionnaireResponseValid(
        questionnaireResponse
      );

      // Then
      expect(isValid).toBe(false);
    });
    it("should return true if the questionnaire response is valid", () => {
      // Given
      const partialFHIRQuestionnaire: Partial<fhir.Questionnaire> = {
        id: "the-id",
        title: "the-title",
        description: "the-description",
        item: [
          {
            repeats: true,
            linkId: "the-link-id",
            type: "boolean",
          },
        ],
      };

      const partialFHIRQuestionnaireResponse: Partial<fhir.QuestionnaireResponse> =
        {
          item: [
            {
              linkId: "the-link-id",
              answer: [
                {
                  valueBoolean: false,
                },
                {
                  valueBoolean: true,
                },
              ],
            },
          ],
        };

      const questionnaire = Questionnaire.fromFHIR(
        partialFHIRQuestionnaire as fhir.Questionnaire
      );

      const questionnaireResponse = QuestionnaireResponse.fromFHIR(
        partialFHIRQuestionnaireResponse as fhir.QuestionnaireResponse
      );

      // When
      const isValid = questionnaire.isQuestionnaireResponseValid(
        questionnaireResponse
      );

      // Then
      expect(isValid).toBe(true);
    });

    it("should return false if the questionnaire is missing required answers", () => {
      // Given
      const partialFHIRQuestionnaire: Partial<fhir.Questionnaire> = {
        id: "the-id",
        title: "the-title",
        description: "the-description",
        item: [
          {
            required: true,
            repeats: true,
            linkId: "the-link-id",
            type: "boolean",
          },
        ],
      };

      const partialFHIRQuestionnaireResponse: Partial<fhir.QuestionnaireResponse> =
        {
          item: [
            {
              linkId: "the-link-id",
              answer: [],
            },
          ],
        };

      const questionnaire = Questionnaire.fromFHIR(
        partialFHIRQuestionnaire as fhir.Questionnaire
      );

      const questionnaireResponse = QuestionnaireResponse.fromFHIR(
        partialFHIRQuestionnaireResponse as fhir.QuestionnaireResponse
      );

      // When
      const isValid = questionnaire.isQuestionnaireResponseValid(
        questionnaireResponse
      );

      // Then
      expect(isValid).toBe(false);
    });
  });
});
