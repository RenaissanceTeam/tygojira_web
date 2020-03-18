export class WorkloadRequestPositionDto {
  constructor(position, skills, employeeId, schedule) {
    this.position = position;
    this.skills = skills;
    this.employeeId = employeeId;
    this.schedule = schedule;
  }
}

export class WorkloadRequestDto {
  constructor(activityId, position) {
    this.activityId = activityId;
    this.positions = [position];
  }
}

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