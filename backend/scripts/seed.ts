import levaOnboarding from "../data/questionnaires/leva-onboarding.json";
import { QuestionnaireModel } from "../src/models/Questionnaire";
import { QuestionnaireResponseModel } from "../src/models/QuestionnaireResponseModel";

const seedDb = async () => {
  await QuestionnaireModel.drop();
  await QuestionnaireResponseModel.drop();
  await QuestionnaireModel.sync({ force: true });
  await QuestionnaireResponseModel.sync({ force: true });

  await QuestionnaireModel.create({
    questionnaireInFhirFormat: levaOnboarding,
    createdAt: new Date(),
  });
};

seedDb();
