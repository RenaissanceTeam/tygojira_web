export const ActivityFields = {
  id: "id",
  name: "name",
  startDate: "startDate",
  endDate: "endDate"
};

export class Activity {
  constructor(id, name, startDate, endDate) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class ActivityDto {
  constructor(name, startDate, endDate) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}