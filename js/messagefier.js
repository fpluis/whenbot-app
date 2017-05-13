const schedulesToMessage = (schedules) => {
  let message = "";
  if (arrayIsEmpty(schedules)) {
    message += "You have no schedules.";
  } else if (schedules.length == 1) {
    const schedule = schedules[0];
    message += getScheduleInformation(schedule);
  } else {
    message += "You have a total of " + schedules.length + " schedules.";
    schedules.forEach((schedule, index) => {
      const indexAsOneIndexed = index + 1;
      message += " Number " + indexAsOneIndexed + " is " + schedule.name + ".";
    });
  }
  return message;
}

const getScheduleInformation = (schedule) => {
  const location = schedule.location;
  const events = schedule.events;
  const description = schedule.description;
  let message = "It's called " + schedule.name + ".";
  message += descriptionToMessage(description);
  if (arrayIsEmpty(events)) {
    message += " It doesn't have any events.";
  } else {
    const eventCount = events.length;
    if (eventCount == 1) {
      message += " It only has one event.";
    } else {
      message += " It has " + events.length + " events.";
    }
  }
  message += locationToMessage(location);
  return message;
}

const descriptionToMessage = (description) => {
  let message = "";
  if (description != null) {
    message += " The description says \"" + extractContent(description) + "\".";
  }
  return message;
}

const extractContent = (html) =>
  (new DOMParser())
    .parseFromString(html, "text/html").documentElement.textContent;

const locationToMessage = (location) => {
  let message = "";
  if (location != null) {
    message += " It's ";
    if (location.name != null) {
      message += " at " + location.name;
    } else if (location.address != null) {
      message += " at " + location.address;
    } else if (location.city != null) {
      message += " in " + location.city;
    } else if (locaiton.country != null) {
      message += " in " + location.country;
    }
    message += ".";
  }
  return message;
}

const eventsToMessage = (events) => {
  let message = "";
  if (arrayIsEmpty(events)) {
    message += "It has no events.";
  } else if (events.length == 1) {
    const event = events[0];
    message += getEventInformation(event);
  } else {
    message += "There are " + events.length + " events: ";
    events.forEach((event, index) => {
      const when = event.when;
      const indexAsOneIndexed = index + 1;
      message += indexAsOneIndexed + ", called " + event.name + ", ";
      message += whenToMessage(when) + ". ";
    });
  }
  return message;
}

const getEventInformation = (event) => {
  let message = "";
  if (event != null) {
    const description = event.description;
    const location = event.location;
    const when = event.when;
    message = "It's called " + event.name + ".";
    message += descriptionToMessage(description);
    const locationMesage = locationToMessage(location);
    message += locationMesage;
    const whenMessage = whenToMessage(when);
    if (locationMesage == "") {
      message += " It's " + whenMessage;
    } else {
      message += whenMessage;
    }
  }
  return message;
}

const whenToMessage = (when) => {
  let message = " ";
  if (when != null
   && when.startDate != null) {
    message += " from " + valueToDateString(when.startDate);
    if (when.endDate != null) {
      message += " to " + valueToDateString(when.endDate) + ".";
    }
  }
  return message;
}