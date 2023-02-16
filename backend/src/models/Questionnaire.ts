import { Model } from "sequelize-typescript";
import { Column, CreatedAt, Table } from "sequelize-typescript";
import { SequelizeInstance } from "../sequelize";
import { DataTypes } from "sequelize";

const sequelize = SequelizeInstance.getInstance();

@Table
export class QuestionnaireModel extends Model {
  id: number;

  @Column(DataTypes.JSON)
  declare questionnaireInFhirFormat: any;

  @CreatedAt
  creationDate: Date;
}

sequelize.addModels([QuestionnaireModel]);
