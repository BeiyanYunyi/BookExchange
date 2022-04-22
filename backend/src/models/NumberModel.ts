import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { _id: false } })
export class BookNumber {
  @prop()
  public _id!: string;

  @prop({ required: true, default: 0 })
  public latest!: number;
}

const NumberModel = getModelForClass(BookNumber);

export default NumberModel;
