// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/orders`
  | `/products`
  | `/products/:productId`
  | `/products/:productId/:variantId`
  | `/settings`
  | `/settings/users`;

export type Params = {
  "/products/:productId": { productId: string };
  "/products/:productId/:variantId": { productId: string; variantId: string };
};

export type ModalPath = `/search`;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>();
export const { redirect } = utils<Path, Params>();
