import {
  validateRequestBody,
  validateRequestParams,
} from "zod-express-middleware";

const serverless = require("serverless-http");
const express = require("express");
import { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import { z } from "zod";
import { QuestionnaireModel } from "./models/Questionnaire";
import {
  fakeAuthMiddleware,
  RequestWithUser,
} from "./middleware/fake-auth-middleware";
import { validateFHIRResource } from "./validation/validate-fhir-resourses";
import { Questionnaire } from "./shared/domain/Questionnaire";
import { QuestionnaireResponse } from "./shared/domain/QuestionnaireResponse";
import { QuestionnaireResponseModel } from "./models/QuestionnaireResponseModel";
const app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(
  "/questionnaire/:id",
  validateRequestParams(
    z.object({
      id: z.preprocess((id) => parseInt(id as string), z.number()),
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const questionnaire = await QuestionnaireModel.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!questionnaire) {
      return res.status(404).json({
        message: `Questionnaire with id ${req.params.id} not found`,
      });
    }

    return res.status(200).json(questionnaire);
  }
);

app.post(
  "/questionnaireResponse",
  fakeAuthMiddleware,
  validateRequestBody(
    z.object({
      questionnaireResponse: z.object({}).passthrough(),
      questionnaireId: z.number(),
    })
  ),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const isQuestionnaireResponseValidFhirResource = validateFHIRResource(
      req.body.questionnaireResponse
    );

    if (!isQuestionnaireResponseValidFhirResource.isValid) {
      return res.status(422).json({
        message:
          "questionnaireResponse is not a valid QuestionnaireResponse resource",
        errors: isQuestionnaireResponseValidFhirResource.errors,
      });
    }

    const questionnaireModel = await QuestionnaireModel.findOne({
      where: {
        id: req.body.questionnaireId,
      },
    });

    if (!questionnaireModel) {
      return res.status(422).json({
        message: `Questionnaire with id ${req.body.questionnaireId} not found`,
      });
    }

    // This controller is beginning to do too much. It could be refactored to use a service.
    const questionnaire = Questionnaire.fromFHIR(
      questionnaireModel.questionnaireInFhirFormat
    );
    const questionnaireResponse = QuestionnaireResponse.fromFHIR(
      req.body.questionnaireResponse
    );

    // We have checked that the questionnaireResponse is a valid FHIR resource, but we still need to check that it is a valid response to the questionnaire.
    const isQuestionnaireResponseValid =
      questionnaire.isQuestionnaireResponseValid(questionnaireResponse);

    if (!isQuestionnaireResponseValid) {
      return res.status(422).json({
        message: `QuestionnaireResponse resource is not a valid response for the questionnaire with id ${req.body.questionnaireId}`,
      });
    }

    const createdQuestionnaireResponse =
      await QuestionnaireResponseModel.create({
        questionnaireId: req.body.questionnaireId,
        questionnaireResponseInFhirFormat: req.body.questionnaireResponse,
        userId: req.user.id,
      });

    res.status(200).json({
      message: "QuestionnaireResponse successfully created",
      createdId: createdQuestionnaireResponse.get("id"),
    });
  }
);

export default app;
export const handler = serverless(app);
