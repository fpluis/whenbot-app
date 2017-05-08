const processChatbotResult = (result) => {
  console.log("The result: " + JSON.stringify(result, null, 2));
  if (result.state != null) {
    handleState(result.state);
  }
  if (result.state == null
  || (result.state != null
   && result.state.appAction != "show_schedules"
   && result.state.appAction != "show_events"
   && result.state.appAction != "update"
   && result.state.appAction != "delete")) {
    addMessage(result.response, "other");
    speakMessage(result.response);
  }

  if (result.event != null) {
    handleEvent(result.event);
  }
}

const handleState = (state) => {
  console.log("Handling the state " + JSON.stringify(state, null, 2))
  let actionParameters = state.parameters;
  const name = getParameterValueByName(actionParameters, "name");
  const description = getParameterValueByName(actionParameters, "description");
  const actionFields = findFieldsInParameters(actionParameters);
  const currentScheduleId = getCurrentScheduleId();
  const currentEventId = getCurrentEventId();
  switch (state.appAction) {
    case "show_schedules":
      if (schedules == null) {
        getSchedules()
        .then((response) => {
          schedules = response;
          updateLocalSchedulesInfo(actionParameters);
          saySchedulesToUser(currentSchedules);
        }).catch((error) => {
          say("There was an error getting the schedules. Can you try again?");
        });
      } else {
        updateLocalSchedulesInfo(actionParameters);
        saySchedulesToUser(currentSchedules);
      }
      break;
    case "show_events":
      if (currentSchedule == null) {
        if (schedules == null) {
          getSchedules()
          .then((response) => {
            schedules = response;
            showEventsToUser(actionParameters);
          }).catch((error) => {
            say("There was an error getting the schedules. Can you try again?");
          });
        } else {
          showEventsToUser(actionParameters);
        }
      } else {
        if (events == null) {
          events = currentSchedule.events;
        }
        updateLocalEventsInfo(actionParameters);
        sayEventsToUser(currentEvents);
      }
      break;
    case "create_schedule":
      const schedule = {
        name: name
      };
      if (description != null) {
        schedule.description = description;
      }
      createSchedule(schedule)
      .then((response) => {
        addScheduleToState(response);
      }).catch((error) => {
        say("There was an error creating the schedule. Can you try again?");
      });
      break;
    case "create_event":
      actionParameters = makePeriodIntoStartAndEndDates(actionParameters);
      const when = makeWhenFromParameters(actionParameters);
      const event = {
        name: name,
        when: when
      }
      if (description != null) {
        event.description = description;
      }
      if (currentSchedule != null
       && currentSchedule.id != null) {
        const scheduleId = currentSchedule.id;
        createEvent(scheduleId, event)
        .then((response) => {
          addEventToState(response);
        }).catch((error) => {
          say("There was an error creating the event. Can you try again?");
        });
      }
      break;
    case "update":
      actionParameters = makePeriodIntoStartAndEndDates(actionParameters);
      if (actionFields.location != null) {
        getPlacesFromAddress(actionFields.location)
        .then((result) => {
          const foundPlaces = result.results;
          let locationName;
          if (arrayIsEmpty(foundPlaces)) {
            actionFields.location = {
              name: actionFields.location
            };
            locationName = actionFields.location.name;
            
          } else {
            actionFields.location = makeLocationFromPlace(foundPlaces[0]);
            locationName = actionFields.location.address;
          }
          say("Ok, the location is " + locationName);
          performUpdate(actionFields);
        });
      } else {
        performUpdate(actionFields);
      }
      break;
    case "delete":
      findAndDeleteEventOrSchedule(actionParameters);
      break;
    case "timeshift":
      timeshift(actionParameters);
      break;
    default:
      break;
  }
}

const showEventsToUser = (actionParameters) => {
  updateLocalSchedulesInfo(actionParameters);
  if (currentSchedule == null) {
    say("You have to first tell me which schedule");
  } else {
    events = currentSchedule.events;
    currentEvents = events;
    sayEventsToUser(currentEvents);
  }
}

const updateLocalSchedulesInfo = (actionParameters) => {
  currentSchedules = filterSchedules(schedules, actionParameters);
  events = null;
  currentEvents = null;
  currentEvent = null;
  if (currentSchedules.length == 1) {
    currentSchedule = currentSchedules[0];
    currentEvents = currentSchedule.events;
  }
}

const getNumberFromParameters = (actionParameters) => {
  const cardinal = getParameterValueByName(actionParameters, "cardinal");
  const ordinal = getParameterValueByName(actionParameters, "ordinal");
  return cardinal == null
    ? ordinal
    : cardinal;
}

const setEventsFromParameters = (actionParameters) => {
  const cardinal = getParameterValueByName(actionParameters, "cardinal");
  const ordinal = getParameterValueByName(actionParameters, "ordinal");
  const number = cardinal == null
    ? ordinal
    : cardinal;
  if (number != null) {
    currentEvent = events[number];
  }
}

const updateLocalEventsInfo = (actionParameters) => {
  currentEvents = filterEvents(events, actionParameters);
  if (currentEvents.length == 1) {
    currentEvent = currentEvents[0];
  }
}

const getParameterValueByName = (actionParameters, name) => {
  if (arrayIsEmpty(actionParameters)) {
    return null;
  } else {
    const parameter = actionParameters.find((parameter) => {
      return parameter.name == name;
    });
    if (parameter == null) {
      return null;
    } else {
      return parameter.value;
    }
  }
}

const handleEvent = (event) => {
  if (event.type == "START") {
    if (event.action == "create_event") {
      currentEvent = null;
    } else if (event.action == "create_schedule") {
      currentSchedule = null;
    }
  }
}

const makePeriodIntoStartAndEndDates = (actionParameters) => {
  const datePeriod = getParameterValueByName(actionParameters, "datePeriod");
  if (datePeriod != null) {
    const startDate = {
      name: "startDate",
      value: datePeriod.start
    };
    const endDate = {
      name: "endDate",
      value: datePeriod.end
    };
    actionParameters.push(startDate);
    actionParameters.push(endDate);
  }
  return actionParameters;
}

const makeWhenFromParameters = (actionParameters) => {
  const period = "minute";
  let when = {};
  const properties = [
    "startDate",
    "endDate"
  ];
  properties.forEach((propertyName) => {
    when = assignPropertyIfExists(when, actionParameters, propertyName);
  });
  if (objectIsEmpty(when)) {
    return null;
  } else {
    when.period = period;
    return when;
  }
}

const assignPropertyIfExists = (object, actionParameters, propertyName) => {
  const property = getParameterValueByName(actionParameters, propertyName);
  if (property != null) {
    object[propertyName] = property;
  }
  return object;
}

const filterSchedules = (schedules, actionParameters) => {
  if (arrayIsEmpty(schedules)) {
    return [];
  } else {
    const name = getParameterValueByName(actionParameters, "name");
    if (name != null) {
      return schedules.filter((schedule) => {
        return isSameStringCaseInsensitive(schedule.name, name);
      });
    }
    const number = getNumberFromParameters(actionParameters);
    if (number != null
     && number <= schedules.length) {
      return [schedules[number - 1]];
    }
    return schedules;
  }
}

const filterEvents = (events, actionParameters) => {
  if (arrayIsEmpty(events)) {
    return [];
  } else {
    const name = getParameterValueByName(actionParameters, "name");
    if (name != null) {
      return events.filter((event) => {
        return isSameStringCaseInsensitive(event.name, name);
      });
    }
    const number = getNumberFromParameters(actionParameters);
    if (number != null) {
      return [events[number - 1]];
    }
    return events;
  }
}

const findFieldsInParameters = (actionParameters) => {
  let updatedFields = {};
  const properties = [
    "name",
    "description",
    "location",
    "schedule",
    "event"
  ];
  properties.forEach((propertyName) => {
    updatedFields = assignPropertyIfExists(updatedFields, actionParameters, propertyName);
  });
  const when = makeWhenFromParameters(actionParameters);
  if (when != null) {
    updatedFields.when = when;
  }
  return updatedFields;
}

const makeLocationFromPlace = (place) => {
  const address = place.formatted_address;
  const geolocation = place.geometry.location;
  const name = place.name;
  return {
    name: name,
    address: address,
    geolocation: geolocation
  }
}

const performUpdate = (updatedFields) => {
  console.log("The updated fields: " + JSON.stringify(updatedFields, null, 2));
  const scheduleId = getCurrentScheduleId();
  const eventId = getCurrentEventId();
  console.log("The schedule id " + scheduleId);
  console.log("The event id " + eventId);
  const wantsToUpdateCurrentSchedule = updatedFields.schedule != null;
  const wantsToUpdateCurrentEvent = updatedFields.event != null;
  delete updatedFields.schedule;
  delete updatedFields.event;
  if (!objectIsEmpty(updatedFields)) {
    if (wantsToUpdateCurrentEvent
    && scheduleId != null
    && eventId != null) {
      updateEventLocallyAndRemotely(updatedFields, scheduleId, eventId)
    } else if (wantsToUpdateCurrentSchedule
    && scheduleId != null) {
      updateScheduleLocallyAndRemotely(updatedFields, scheduleId);
    } else if (eventId != null
            && scheduleId != null) {
      updateEventLocallyAndRemotely(updatedFields, scheduleId, eventId)
    } else if (scheduleId != null) {
      updateScheduleLocallyAndRemotely(updatedFields, scheduleId);
    } else {
      say("I don't know what you are trying to update");
    }
  }
}

const updateEventLocallyAndRemotely = (updatedFields, scheduleId, eventId) => {
  console.log("Updated fields: " + JSON.stringify(updatedFields, null, 2))
  updatedFields = fixEventUpdatedFields(updatedFields);
  updateCurrentEvent(updatedFields);
  say("The new event: " + getEventInformation(currentEvent));
  updateEvent(updatedFields, scheduleId, eventId)
  .then((result) => {
    say("You updated the event");
  }).catch((error) => {
    say("There was an error updating the event. Can you try again?");
  });
}

const updateScheduleLocallyAndRemotely = (updatedFields, scheduleId) => {
  updatedFields = fixScheduleUpdatedFields(updatedFields);
  updateCurrentSchedule(updatedFields);
  say("The new schedule: " + getScheduleInformation(currentSchedule));
  updateSchedule(updatedFields, scheduleId)
  .then(() => {
    say("You updated the schedule");
  }).catch((error) => {
    say("There was an error updating the schedule. Can you try again?");
  });
}

const fixScheduleUpdatedFields = (updatedFields) => {
  if (updatedFields.name == null) {
    updatedFields.name = currentSchedule.name;
  }
  return updatedFields;
}

const fixEventUpdatedFields = (updatedFields) => {
  console.log("Updated fields: " + JSON.stringify(updatedFields, null, 2))
  if (updatedFields.name == null) {
    updatedFields.name = currentEvent.name;
  }
  if (updatedFields.when != null
  && updatedFields.when.startDate == null) {
    console.log("The event " + JSON.stringify(currentEvent, null, 2));
    console.log("The startDate " + currentEvent.when.startDate);
    updatedFields.when.startDate = currentEvent.when.startDate;
  }
  return updatedFields;
}

const getEventIdFromParameters = (actionParameters) => {
  if (events == null
  && currentSchedule != null) {
    events = currentSchedule.events;
  }
  const filteredEvents = filterEvents(events, actionParameters);
  return arrayIsEmpty(filteredEvents)
    ? null
    : filteredEvents[0].id;
}

const getScheduleIdFromParameters = (actionParameters) => {
  const filteredSchedules = filterSchedules(schedules, actionParameters);
  return arrayIsEmpty(filteredSchedules)
    ? null
    : filteredSchedules[0].id;
}

const findAndDeleteEventOrSchedule = (actionParameters) => {
  let eventId = getEventIdFromParameters(actionParameters);
  if (eventId == null) {
    eventId = getCurrentEventId();
  }
  let scheduleId = getScheduleIdFromParameters(actionParameters);
  if (scheduleId == null) {
    scheduleId = getCurrentScheduleId();
  }
  console.log("The schedule id " + scheduleId);
  console.log("The event id " + eventId);
  const wantsToDeleteSchedule = getParameterValueByName(actionParameters, "schedule") != null;
  const wantsToDeleteEvent = getParameterValueByName(actionParameters, "event") != null;
  if (wantsToDeleteEvent
  && scheduleId != null
  && eventId != null) {
    startEventDeletion(scheduleId, eventId)
  } else if (wantsToDeleteSchedule
  && scheduleId != null) {
    startScheduleDeletion(scheduleId);
  } else if (eventId != null
          && scheduleId != null) {
    startEventDeletion(scheduleId, eventId)
  } else if (scheduleId != null) {
    startScheduleDeletion(scheduleId);
  } else {
    say("I don't know what you are trying to delete");
  }
}

const startEventDeletion = (scheduleId, eventId) => {
  const deletedEvent = getEventById(scheduleId, eventId);
  say("Deleting this event: " + getEventInformation(deletedEvent));
  deleteEvent(scheduleId, eventId)
  .then((result) => {
    removeEventFromState(scheduleId, eventId);
    say("You deleted the event");
  })
  .catch((error) => {
    say("There was an error deleting the event. Can you try again?");
  });
}

const startScheduleDeletion = (scheduleId) => {
  const deletedSchedule = getScheduleById(scheduleId);
  say("Deleting this schedule: " + getScheduleInformation(deletedSchedule));
  deleteSchedule(scheduleId)
  .then((result) => {
    removeScheduleFromState(scheduleId);
    say("You deleted the schedule");
  }).catch((error) => {
    say("There was an error deleting the schedule. Can you try again?");
  });
}

const timeshift = (actionParameters) => {
  const timeQuantity = getParameterValueByName(actionParameters, "timeQuantity");
  const direction = getParameterValueByName(actionParameters, "direction");
  const newStart = getParameterValueByName(actionParameters, "newStart");
  let scheduleToShiftId = getCurrentScheduleId();
  console.log("Current schedule id " + scheduleToShiftId)
  if (!arrayIsEmpty(actionParameters)) {
    scheduleToShiftId = getScheduleIdFromParameters(actionParameters);
  }
  console.log("Schedule id from parameters " + scheduleToShiftId)
  console.log("Time quantity: " + timeQuantity);
  console.log("Direction: " + direction);
  if (scheduleToShiftId == null) {
    say("I don't know which schedule to shift!")
  } else {
    const scheduleToShift = getScheduleById(scheduleToShiftId);
    console.log("Current schedule " + JSON.stringify(currentSchedule, null, 2))
    console.log("Schedule to timeshift " + JSON.stringify(scheduleToShift, null, 2))
    console.log(!arrayIsEmpty(scheduleToShift.events))
    if (scheduleToShift != null) {
        const newStartTimeQuantity = getNewStartTimeQuantity(scheduleToShift.events, newStart);
        const newEvents = [];
        scheduleToShift.events.forEach((event) => {
          const when = event.when;
          if (newStart != null) {
            console.log("The time added to each event: " + newStartTimeQuantity)
            when.startDate = new Date(new Date(when.startDate).getTime() + newStartTimeQuantity);
            if (when.endDate != null) {
              when.endDate = new Date(new Date(when.endDate).getTime() + newStartTimeQuantity);
            }
          } else {
            if (direction == "forward"
            || direction == "forwards"
            || direction == "into the future") {
              when.startDate = new Date(new Date(when.startDate).getTime() + timeQuantity);
              if (when.endDate != null) {
                when.endDate = new Date(new Date(when.endDate).getTime() + timeQuantity);
              }
            } else {
              when.startDate = new Date(new Date(when.startDate).getTime() - timeQuantity);
              if (when.endDate != null) {
                when.endDate = new Date(new Date(when.endDate).getTime() - timeQuantity);
              }
            }
          }
          console.log("The new when: " + JSON.stringify(when, null, 2))
          const updatedFields = {
            when: when
          };
          event.when = when;
          newEvents.push(event);
          updateEvent(updatedFields, scheduleToShiftId, event.id)
          .catch((error) => {
            say("There was an error updating the event. Can you try again?");
          });
      });
      scheduleToShift.events = newEvents;
      updateScheduleInSchedules(scheduleToShift);
    } else {
      say("I don't know which schedule to shift!")
    }
  }
}

const getNewStartTimeQuantity = (events, newStart) => {
  console.log("ARRAYS " + JSON.stringify(events, null, 2));
  if (arrayIsEmpty(events) || events.constructor != Array) {
    return 0;
  } else {
    const newStartDate = new Date(newStart);
    const eventWithSoonestStartingDate = getEventWithSoonestStartingDate(events);
    console.log("Event with soonest " + JSON.stringify(eventWithSoonestStartingDate, null, 2));
    return new Date(newStart).getTime() - new Date(eventWithSoonestStartingDate.when.startDate).getTime();
  }
}

const getEventWithSoonestStartingDate = (events) => {
  let eventWithSoonestStartingDate = events[0];
  events.forEach((event) => {
    if (new Date(event.when.startDate) <= new Date(eventWithSoonestStartingDate)) {
      eventWithSoonestStartingDate = event;
    };
  });

  return eventWithSoonestStartingDate;
}