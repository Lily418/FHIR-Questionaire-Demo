import request from "supertest";
import app from "./index";
import { QuestionnaireModel } from "./models/Questionnaire";
import fhir from "fhir/r5";
import { QuestionnaireResponseModel } from "./models/QuestionnaireResponseModel";

describe("questionnaire", () => {
  describe("GET /questionnaire/:id", () => {
    let knownFhirQuestionnaireId: number;
    let knownFhirQuestionnaire: any;
    let nonExistentFhirQuestionnaireId = -1;

    beforeAll(async () => {
      // In the real world there would be some shared code to manage test state and start a fresh with a clean database each time,
      // this is just to quickly setup LH 2023-02-14
      await QuestionnaireModel.drop();
      await QuestionnaireModel.sync({ force: true });

      knownFhirQuestionnaire = {
        resourceType: "Questionnaire",
      };

      const createdFHIRQuestionnaire: QuestionnaireModel =
        await QuestionnaireModel.create({
          questionnaireInFhirFormat: knownFhirQuestionnaire,
          createdAt: new Date(),
        });

      knownFhirQuestionnaireId = createdFHIRQuestionnaire.id;
    });

    it("should throw an error if id is not a number", async () => {
      await request(app).get(`/questionnaire/not-a-number`).expect(400);
    });

    it("should throw an error when getting a non existent questionnaire", async () => {
      await request(app)
        .get(`/questionnaire/${nonExistentFhirQuestionnaireId}`)
        .expect(404);
    });

    it("should return a questionnaire when getting a known questionnaire", async () => {
      const response = await request(app)
        .get(`/questionnaire/${knownFhirQuestionnaireId}`)
        .expect(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          id: knownFhirQuestionnaireId,
          questionnaireInFhirFormat: knownFhirQuestionnaire,
        })
      );
    });
  });
});

describe("questionnaireResponse", () => {
  describe("POST /questionnaireResponse", () => {
    let knownFhirQuestionnaireId: number;
    let nonExistentFhirQuestionnaireId = -1;

    beforeAll(async () => {
      await QuestionnaireModel.drop();
      await QuestionnaireModel.sync({ force: true });

      await QuestionnaireResponseModel.drop();
      await QuestionnaireResponseModel.sync({ force: true });

      const fhirQuestionnaire = {
        id: "1",
        title: "the-title",
        description: "the-description",
        resourceType: "Questionnaire",
        item: [
          {
            linkId: "1",
            text: "the-text",
            type: "boolean",
          },
        ],
      };

      const createdFHIRQuestionnaire = await QuestionnaireModel.create({
        questionnaireInFhirFormat: fhirQuestionnaire,
        createdAt: new Date(),
      });

      knownFhirQuestionnaireId = createdFHIRQuestionnaire.id;
    });

    it("should throw an error if the request body is missing the questionnaireId", async () => {
      await request(app)
        .post("/questionnaireResponse")
        .send({
          questionnaireResponse: {},
        })
        .expect(400);
    });

    it("should throw an error if the request body is missing questionnaireResponse", async () => {
      await request(app)
        .post("/questionnaireResponse")
        .send({
          questionnaireId: 1,
        })
        .expect(400);
    });

    it("should throw an error if the questionnaire with questionnaireId cannot be found", async () => {
      const response = await request(app)
        .post("/questionnaireResponse")
        .send({
          questionnaireId: nonExistentFhirQuestionnaireId,
          questionnaireResponse: {
            resourceType: "QuestionnaireResponse",
          },
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        message: `Questionnaire with id ${nonExistentFhirQuestionnaireId} not found`,
      });
    });

    it("should throw an error if the questionnaireResponse is not valid", async () => {
      const response = await request(app)
        .post("/questionnaireResponse")
        .send({
          questionnaireId: knownFhirQuestionnaireId,
          questionnaireResponse: {
            resourceType: "CarePlan",
          },
        })
        .expect(422);

      expect(response.body).toStrictEqual(
        expect.objectContaining({
          message: `questionnaireResponse is not a valid QuestionnaireResponse resource`,
        })
      );
    });

    it("should throw an error if the questionnaireResponse is not valid for the questionnaire", async () => {
      const response = await request(app)
        .post("/questionnaireResponse")
        .send({
          title: "a-title",
          description: "a-description",
          questionnaireId: knownFhirQuestionnaireId,
          questionnaireResponse: {
            resourceType: "QuestionnaireResponse",
            item: [
              {
                linkId: "1",
                answer: [
                  {
                    valueBoolean: "not a boolean",
                  },
                ],
              },
            ],
          },
        })
        .expect(422);

      expect(response.body).toStrictEqual({
        message: `QuestionnaireResponse resource is not a valid response for the questionnaire with id ${knownFhirQuestionnaireId}`,
      });
    });

    it("should successfully create a questionnaire response if all is valid", async () => {
      // Given
      const questionnaireResponse: Partial<fhir.QuestionnaireResponse> = {
        resourceType: "QuestionnaireResponse",
        item: [
          {
            linkId: "1",
            answer: [
              {
                valueBoolean: true,
              },
            ],
          },
        ],
      };

      // When
      const response = await request(app)
        .post("/questionnaireResponse")
        .send({
          questionnaireId: knownFhirQuestionnaireId,
          questionnaireResponse,
        })
        .expect(200);

      // Then
      const createdQuestionnaireResponse =
        await QuestionnaireResponseModel.findOne({
          where: {
            id: response.body.createdId,
          },
        });

      expect(response.body.createdId).toBeDefined();
      expect(createdQuestionnaireResponse.get("questionnaireId")).toBe(
        knownFhirQuestionnaireId
      );
      expect(
        createdQuestionnaireResponse.get("questionnaireResponseInFhirFormat")
      ).toStrictEqual(questionnaireResponse);
    });
  });
});
