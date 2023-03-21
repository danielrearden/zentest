import { RequestHandler, Protocol, Service } from "restana";

export type App = Service<Protocol.HTTP>;

export type Handler = RequestHandler<Protocol.HTTP>;
