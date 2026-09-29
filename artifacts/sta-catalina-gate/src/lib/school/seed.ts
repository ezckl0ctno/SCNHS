import type { NotifySettings, SchoolState } from "./types";

export const emptyNotify = (): NotifySettings => ({
  emailUser: "",
  emailPass: "",
  emailHost: "smtp.gmail.com",
  smsKey: "",
  smsSender: "SCNGATE",
});

export function seedState(): SchoolState {
  return {
    school: {
      name: "Sta Catalina National High School",
      campus: "Sta. Catalina",
      arrivalStart: "07:30",
      arrivalEnd: "08:10",
      absentCutoff: "08:30",
      dismissStart: "16:00",
      notify: emptyNotify(),
    },
    officePasswordHash: null,
    parents: [],
    students: [],
    attendance: [],
    alerts: [],
    session: { role: "none" },
  };
}
