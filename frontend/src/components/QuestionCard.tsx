import { ReactNode } from "react";
import { Card } from "@nextui-org/react";

export const QuestionCard: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Card css={{ margin: "20px" }}>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
};
