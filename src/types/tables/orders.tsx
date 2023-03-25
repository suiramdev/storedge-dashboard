import { Row } from "./defaults";

export interface OrderRow extends Row {
  id: string;
  customer: string;
  total: number;
  status: string;
