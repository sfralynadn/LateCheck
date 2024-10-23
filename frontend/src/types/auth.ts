export interface Auth {
  id: number;
  email: string;
  last_logged_in: string;
  role: "TEACHER" | "STUDENT" | "ADMIN";
  profile: {
    name: string;
    nip?: string;
    nis?: string;
    address: string;
    classroom: {
      name: string;
      created_at: string;
      updated_at: string;
    };
  };
}
