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
  | `/settings/access-control`
  | `/settings/access-control/roles/:id`
  | `/settings/access-control/users/:id`;

export type Params = {
  "/products/:productId": { productId: string };
  "/products/:productId/:variantId": { productId: string; variantId: string };
  "/settings/access-control/roles/:id": { id: string };
  "/settings/access-control/roles/:id": { id: string };
  "/settings/access-control/users/:id": { id: string };
};

export type ModalPath = `/search`;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>();
export const { redirect } = utils<Path, Params>();
