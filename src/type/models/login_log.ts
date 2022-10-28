import { Document, Model } from 'mongoose'
import { BaseModel, BaseDocument } from "./base";

export interface ILoginLog extends BaseDocument, Document {
  _id: String,
  user_id: String,
  account_id: String,
  log_time: Date,
  log_ip: String,
  log_device: String,
  log_plat: String,
  log_version: String,
  log_model: String,
  log_region: String,
}

export interface MLoginLog extends BaseModel<ILoginLog>, Model<ILoginLog> {

}