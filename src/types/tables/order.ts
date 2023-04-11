import { Row } from "./default";

export enum OrderStatus {
  PENDING,
  PROCESSING,
  COMPLETED,
}

export interface OrderRow extends Row {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
}
