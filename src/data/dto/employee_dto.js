export const FullEmployeeInfoDtoFields = {
  id: "id",
  firstName: "firstName",
  lastName: "lastName",
  middleName: "middleName",
  position: "position",
  skills: "skills",
  subdivision: "subdivision",
  workRoles: "workRoles"
};

export class EmployeeDto {
  constructor(username, firstName, lastName, middleName, position, subdivision) {
    this.username    = username;
    this.firstName   = firstName;
    this.lastName    = lastName;
    this.middleName  = middleName;
    this.position    = position;
    this.subdivision = subdivision;
  }
}

export class EmployeeWithRoleDto {
  constructor(employeeDto, roles) {
    this.employee = employeeDto;
    this.roles    = roles;
  }
}

export class UpdateEmployeeInfoDto {
  constructor(skills, workRoles) {
    this.skills    = skills;
    this.workRoles = workRoles;
  }
}