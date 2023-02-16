import { validateFHIRResource } from "./validate-fhir-resourses";

describe("validate FHIR resources", () => {
  describe("validate questionnaire response", () => {
    it("should throw an error if resourceType does not match QuestionnaireResponse", () => {
      // Given
      const invalidQuestionnaireResponse = {
        resourceType: "CarePlan",
      };

      // When
      const validationResult = validateFHIRResource(
        invalidQuestionnaireResponse
      );

      // Then
      expect(validationResult).toStrictEqual({
        isValid: false,
        errors: [
          {
            dataPath: "resourceType",
            reason: "Unknown resourceType CarePlan",
          },
        ],
      });
    });

    it("should not throw an error if resource is valid", () => {
      // Given
      const invalidQuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
      };

      // When
      const validationResult = validateFHIRResource(
        invalidQuestionnaireResponse
      );

      // Then
      expect(validationResult).toStrictEqual({
        isValid: true,
        errors: [],
      });
    });
  });
});
