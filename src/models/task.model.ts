interface IReminders {
  name: string;
  date: Date;
}

export interface ITask {
  id?: number;
  profilePicture?: string;
  category: string;
  title: string;
  description?: string;
  deadline?: Date;
  location?: string;
  reminders?: [IReminders];
  status?: string;
  [key: string]: any;
}
