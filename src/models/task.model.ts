export interface IReminders {
  id?: string;
  date?: Date;
}

export interface ITask {
  id?: number;
  globalPicture?: string;
  category: string;
  title: string;
  description?: string;
  deadline?: Date;
  location?: string;
  reminders?: IReminders[];
  status?: string;
  [key: string]: any;
}
