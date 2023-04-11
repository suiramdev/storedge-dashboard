import { ColumnDef } from "@tanstack/react-table";

export interface Row {
  href?: string;
}

export type Column<T extends Row = any> = ColumnDef<T, any>;
