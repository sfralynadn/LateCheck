import { Classroom } from "./classroom";

export interface Student {
  id: number;
  name: string;
  gender: "M" | "W";
  classroom: Classroom;
  address: string;
}
