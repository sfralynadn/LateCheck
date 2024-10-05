import { Classroom } from "./classroom";

export interface Auth {
  id: string;
  nip: string;
  name: string;
  role: number;
  classroom: Classroom;
}
