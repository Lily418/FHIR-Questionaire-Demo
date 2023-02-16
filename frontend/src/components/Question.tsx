import { Question } from "../shared/domain/Questionnaire";
import { Checkbox, Radio, Input, Grid } from "@nextui-org/react";
import { useState } from "react";

const ChoiceComponent: React.FC<{
  question: Question;
  onChange: (value: string[]) => void;
}> = ({ question, onChange }) => {
  let choices;

  const [selectionValue, setSelectionValue] = useState<string[]>([]);
  const [freeInputValue, setFreeInputValue] = useState<string | undefined>(
    undefined
  );

  if (question.repeats) {
    choices = (
      <Checkbox.Group
        onChange={(value) => {
          setSelectionValue(value);
          onChange(freeInputValue ? [...value, freeInputValue] : value);
        }}
        defaultValue={undefined}
        label={question.text}
      >
        {question.options.map((option) => {
          return <Checkbox value={option.code}>{option.display}</Checkbox>;
        })}
      </Checkbox.Group>
    );
  } else {
    choices = (
      <Radio.Group
        label={question.text}
        onChange={(value) => {
          setSelectionValue([value]);
          onChange(freeInputValue ? [value, freeInputValue] : [value]);
        }}
      >
        {question.options.map((option) => {
          return <Radio value={option.code}>{option.display}</Radio>;
        })}
      </Radio.Group>
    );
  }
  return (
    <Grid.Container direction="column">
      {choices}
      {question.type === "open-choice" && (
        <Input
          css={{ margin: "20px 0" }}
          label={"Other"}
          onChange={(e) => {
            const value =
              e.target.value.trim() === "" ? undefined : e.target.value;
            setFreeInputValue(value);
            onChange(value ? [...selectionValue, value] : [...selectionValue]);
          }}
        />
      )}
    </Grid.Container>
  );
};

export const QuestionInputComponent: React.FC<{
  question: Question;
  onChange: (value: string[] | boolean[]) => void;
}> = ({ question, onChange }) => {
  switch (question.type) {
    case "choice":
    case "open-choice":
      return <ChoiceComponent question={question} onChange={onChange} />;
    case "boolean":
      return (
        <ChoiceComponent
          question={{
            ...question,
            options: [
              { code: "true", display: "Yes" },
              { code: "false", display: "No" },
            ],
          }}
          onChange={(value) => onChange(value.map((v) => v === "true"))}
        />
      );
    default:
      throw Error("Unsupported question type: " + question.type);
  }
};
