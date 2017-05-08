let textToSpeechEnabled = true;
let currentSchedule, currentEvent, schedules, currentSchedules, events,
    currentEvents, lastCreatedEvent, lastCreatedSchedule;

const updateCurrentSchedule = (updatedFields) => {
  currentSchedule = assignProperties(currentSchedule, updatedFields);
  updateScheduleInSchedules(currentSchedule);
}

const updateScheduleInSchedules = (schedule) => {
  if (schedules == null) {
    schedules = [schedule];
  } else {
    const scheduleIndex = schedules.findIndex((storedSchedule) => {
      return storedSchedule.id == schedule.id;
    })
    schedules[scheduleIndex] = schedule;
  }
}

const updateCurrentEvent = (updatedFields) => {
  currentEvent = assignProperties(currentEvent, updatedFields);
  const scheduleId = currentEvent.scheduleId;
  const scheduleToUpdate = getScheduleById(scheduleId);
  if (arrayIsEmpty(scheduleToUpdate.events)) {
    scheduleToUpdate.events = [event];
  } else {
    const eventIndex = scheduleToUpdate.events.findIndex((event) => {
      return event.id == currentEvent.id;
    });
    scheduleToUpdate.events[eventIndex] = currentEvent;
  }
  updateScheduleInSchedules(scheduleToUpdate);
}

const removeEventFromState = (scheduleId, eventId) => {
  currentEvent = null;
  currentEvents = removeFromArrayById(currentEvents, eventId);
  events = removeFromArrayById(events, eventId);
  if (schedules != null) {
    const scheduleToUpdate = getScheduleById(scheduleId)
    const newEvents = scheduleToUpdate.events.filter((event) => {
      return event.id != eventId;
    });
    scheduleToUpdate.events = newEvents;
    const indexOfUpdatedSchedule = schedules.findIndex((schedule) => {
      return schedule.id == scheduleId;
    });
    schedules[indexOfUpdatedSchedule] = scheduleToUpdate;
  }
}

const getScheduleById = (scheduleId) => {
  return schedules.find((schedule) => {
    return schedule.id == scheduleId;
  });
}

const getEventById = (scheduleId, eventId) => {
  const schedule = getScheduleById(scheduleId);
  return schedule.events.find((event) => {
    return event.id == eventId;
  })
}

const getCurrentScheduleId = () => {
  return currentSchedule == null
    ? null
    : currentSchedule.id;
}

const getCurrentEventId = () => {
  return currentEvent == null
    ? null
    : currentEvent.id;
}

const removeScheduleFromState = (scheduleId) => {
  currentSchedules = removeFromArrayById(currentSchedules, scheduleId);
  schedules = removeFromArrayById(schedules, scheduleId);
}

const addScheduleToState = (schedule) => {
  lastCreatedSchedule = schedule;
  currentSchedule = schedule;
  if (arrayIsEmpty(schedules)) {
    schedules = [schedule];
  } else {
    schedules.push(schedule);
  }
}

const addEventToState = (event) => {
  lastCreatedEvent = event;
  currentEvent = event;
  const scheduleId = event.scheduleId;
  const scheduleToUpdate = getScheduleById(scheduleId);
  if (arrayIsEmpty(scheduleToUpdate.events)) {
    scheduleToUpdate.events = [event];
  } else {
    scheduleToUpdate.events.push(event);
  }
  updateScheduleInSchedules(scheduleToUpdate);
}