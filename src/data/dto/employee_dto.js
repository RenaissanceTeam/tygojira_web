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

export class FullEmployeeInfoDto {
  constructor(id, firstName, middleName, lastName, position, subdivision, skills) {
    this.id          = id;
    this.firstName   = firstName;
    this.middleName  = middleName;
    this.lastName    = lastName;
    this.position    = position;
    this.subdivision = subdivision;
    this.skills      = skills;
  }
}

export class EmployeeDto {
  constructor(username, firstName, middleName, lastName, position, subdivision, skills) {
    this.username    = username;
    this.firstName   = firstName;
    this.middleName  = middleName;
    this.lastName    = lastName;
    this.position    = position;
    this.subdivision = subdivision;
    this.skills      = skills;
  }
}

export class EmployeeWithRoleDto {
  constructor(employeeDto, roles) {
    this.employee = employeeDto;
    this.roles    = roles;
  }
}

export class EmployeeFilter {
  constructor(firstName, middleName, lastName, position, subdivision, skills, availableOn) {
    this.firstName   = firstName;
    this.middleName  = middleName;
    this.lastName    = lastName;
    this.position    = position;
    this.skills      = skills;
    this.availableOn = availableOn;
  }
}

export class UpdateEmployeeInfoDto {
  constructor(firstName, middleName, lastName, subdivision, skills, position) {
    this.firstName   = firstName;
    this.middleName  = middleName;
    this.lastName    = lastName;
    this.subdivision = subdivision;
    this.skills      = skills;
    this.position    = position;
  }
}

export class EmployeeWithUpdateEmployeeInfoDto {
  constructor(employee, updateEmployeeInfoDto) {
    this.employee = employee;
    this.updateEmployeeInfoDto = updateEmployeeInfoDto;
  }
}

export const EMPTY_EMPLOYEE_DTO = new EmployeeDto("", "", "", "", "", "", []);
export const EMPTY_FULL_EMPLOYEE_INFO_DTO = new FullEmployeeInfoDto("", "", "", "", "", "", []);