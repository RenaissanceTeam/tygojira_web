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
  constructor(name, startDate, endDate, leadId) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.leadId = leadId;
  }
}

export class ActivityWithActivityDto {
  constructor(activity, activityDto) {
    this.activity = activity;
    this.activityDto = activityDto;
  }
}

export class CloseActivityDto {
  constructor(closureDate) {
    this.closureDate = closureDate;
  }
}