import { DataTypes } from "sequelize";
import { SequelizeInstance } from "../sequelize";

const sequelize = SequelizeInstance.getInstance();

export const QuestionnaireResponseModel = sequelize.define(
  "QuestionnaireResponse",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questionnaireId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionnaireResponseInFhirFormat: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }
);
