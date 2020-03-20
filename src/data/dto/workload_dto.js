export class WorkloadScheduleDto {
  constructor(start, end, monday, tuesday, wednesday, thursday, friday) {
    this.start = start;
    this.end = end;
    this.monday = monday;
    this.tuesday = tuesday;
    this.wednesday = wednesday;
    this.thursday = thursday;
    this.friday = friday;
  }
}

export class WorkloadRequestInDto {
  constructor(activityId, position, skills, schedule, employeeId) {
    this.activityId = activityId;
    this.position = position;
    this.skills = skills;
    this.schedule = schedule;
    this.employeeId = employeeId;
  }
}

export class EmployeeIdDto {
  constructor(employeeId) {
    this.employeeId = employeeId;
  }
}