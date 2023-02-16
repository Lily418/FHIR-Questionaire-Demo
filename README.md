# Leva Onboarding Questionnaire

## FHIR

I decided to use a data driven approach to the questionnaire.

For the data model I use FHIR health care data interoperability standard to model the leva onboarding questions.

The data that drives the application is stored in the file
`backend/data/questionnaires/leva-onboarding.json`

#### FHIR Resources

[FHIR Questionnaire](https://www.hl7.org/fhir/questionnaire.html)

[FHIR QuestionnaireResponse](https://www.hl7.org/fhir/questionnaireresponse.html)

## System Components

### /backend

The backend is responsible

- Storing the questionnaire data
- Validating the questionnaire responses
- Storing the questionnaire responses

### /frontend

The frontend can take the FHIR Questionnaire resources and render a form.
It can then submit the completed form as a FHIR QuestionnaireResponse resource.

### /shared

There are some shared domain models that are used by both the frontend and the backend. This allows data transfer to happen via FHIR resources
but allows for shared validation and domain logic.

### Advantages

- Interoperability - By using FHIR resources we can easily exchange data with other systems that use FHIR. There are FHIR representations of many standardised healthcare questionnaires.
- Auditability - We have a data representation of the questionnaire that has been completed. We can combine this with document versioning to determine the exact question and answers that a patient has given. This infomation may be lost using a different appoach.
- Flexibility - We can update the questionnaire without updating the application code.
- Extendability & Reusability - At the moment this proof of concept supports few features possible in FHIR questionnaires but can be extended to support many questionnaires in this format.

### Disadvantages

- Complexity - The FHIR specification is large and complex. A much simpler approach could be used to achieve the same result if value is not seen in a generic solution.

## Next Steps

- Clientside validation and error handling. -
- Extend serverside validation. It is currently a placeholder, there is much more validation that can be done on the questionnaire responses.
- Prevent double submit of form
- FHIR Questionnaire renderer could be extended to support more features of the FHIR Questionnaire specification.
