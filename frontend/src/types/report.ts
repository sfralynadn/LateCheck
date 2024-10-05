import { Student } from "./student";

export interface Report {
  id: number;
  student: Student;
  description: string;
  date: string;
}
