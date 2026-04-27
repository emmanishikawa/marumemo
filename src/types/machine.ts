import { Capsule } from "./capsule";

export type Machine = {
  id: string;
  capsules: Capsule[];
  isFinalized: boolean;
};