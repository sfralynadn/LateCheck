import { Classroom } from "./classroom";

export interface Student {
  id: number;
  nis: string;
  name: string;
  gender: "M" | "W";
  classroom: Classroom;
  address: string;
}
