let textToSpeechEnabled = false;
let currentSchedule, currentEvent, schedules, currentSchedules, events,
    currentEvents, lastCreatedEvent, lastCreatedSchedule;

const updateCurrentSchedule = (updatedFields) => {
  console.log("Updated fields to the schedule " + JSON.stringify(updatedFields, null, 2))
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
  console.log("Updated fields to the event " + JSON.stringify(updatedFields, null, 2));
  currentEvent = assignProperties(currentEvent, updatedFields);
  console.log("Current event: " + JSON.stringify(currentEvent, null, 2))
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