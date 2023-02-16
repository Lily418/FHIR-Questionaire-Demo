interface ValidationResult {
  isValid: boolean;
  errors: { dataPath: string; reason: string }[];
}

export const validateFHIRResource = (resource: any): ValidationResult => {
  switch (resource.resourceType) {
    case "QuestionnaireResponse":
      return validateQuestionnaireResponse(resource);
    default:
      return {
        isValid: false,
        errors: [
          {
            dataPath: "resourceType",
            reason: `Unknown resourceType ${resource.resourceType}`,
          },
        ],
      };
  }
};

const validateQuestionnaireResponse = (
  questionnaireResponse: any
): ValidationResult => {
  // This is a placeholder for a real validation LH 2023-02-15

  return {
    isValid: true,
    errors: [],
  };
};
