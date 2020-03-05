import api from "./api";

const productionCalendarMapping = "/holidays";

export default {
  updateHoliday: (id, holidayDto) =>
    api.patch(`${productionCalendarMapping}/${id}`, holidayDto),
  deleteHoliday: id =>
    api.delete(`${productionCalendarMapping}/${id}`),
  addHoliday: holidayDto =>
    api.put(productionCalendarMapping, holidayDto),
  getHolidays: year =>
    api.get(productionCalendarMapping, {
      params: {
        year: year
      }
    })
}