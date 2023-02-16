import { QuestionnaireResponse } from "./QuestionnaireResponse";
import fhir from "fhir/r5";

// As this becomes more complex it could become an abstract class
// and have different concrete implementations based on the type enum
export class Question {
  constructor(
    public linkId: string,
    public type: string,
    public text: string,
    public repeats: boolean,
    public required: boolean,
    public options: {
      code: string;
      display: string;
    }[]
  ) {}

  static fromFHIR(questionnaireItem: any): Question {
    const options = questionnaireItem?.answerOptions
      ? questionnaireItem.answerOptions.map((item: any) => {
          return {
            code: item.valueCoding.code,
            display: item.valueCoding.display,
          };
        })
      : [];

    return new Question(
      questionnaireItem.linkId,
      questionnaireItem.type,
      questionnaireItem.text,
      questionnaireItem.repeats,
      questionnaireItem.required,
      options
    );
  }
}

export class Questionnaire {
  private constructor(
    private _id: string,
    private _title: string,
    private _description: string,
    private _questions: Question[]
  ) {}

  static fromFHIR(fhirQuestionnaire: fhir.Questionnaire): Questionnaire {
    if (
      !fhirQuestionnaire.item ||
      !fhirQuestionnaire.id ||
      !fhirQuestionnaire.title ||
      !fhirQuestionnaire.description
    ) {
      throw new Error("FHIR Questionnaire is missing ID, items or title");
    }

    return new Questionnaire(
      fhirQuestionnaire.id,
      fhirQuestionnaire.title,
      fhirQuestionnaire.description,
      fhirQuestionnaire.item.map(Question.fromFHIR)
    );
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get questions(): Question[] {
    return this._questions;
  }

  isQuestionnaireResponseValid(
    questionnaireResponse: QuestionnaireResponse
  ): boolean {
    /** Other validation is possible here, for example the answer should only multiple values if the question is set as repeatable.
     * I would also want to collect error messages explaining why the questionnaire response is invalid.
     */
    const answersValid = questionnaireResponse.answers.map((answer) => {
      const question = this.questions.find((question) => {
        return question.linkId === answer.linkId;
      });

      if (!question) {
        return false;
      }

      if (question.type === "boolean") {
        const allAnswersBoolean = answer.value.every(
          (value) => typeof value === "boolean"
        );
        if (!allAnswersBoolean) {
          return false;
        }
      }

      if (question.required) {
        if (answer.value.length === 0) {
          return false;
        }
      }

      return true;
    });

    return answersValid.every((answerValid) => answerValid === true);
  }
}
