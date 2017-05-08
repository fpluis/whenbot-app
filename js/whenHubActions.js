//const WHENHUB_ACCESS_TOKEN = "5E7zrXzTiHtDgLodKQOiP7JMF5MMM97lHmAaP820xPEBZ03iUhVYR5nruTobUwBP";
const WHENHUB_ACCESS_TOKEN = getQueryParameter().token;
const WHENHUB_USER_ID = getQueryParameter().userId;

let WHENHUB_API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': WHENHUB_ACCESS_TOKEN
};

const USER_BASE_URL = "https://api.whenhub.com/api/users/me/";
const GENERIC_BASE_URL = "https://api.whenhub.com/api/";
const USER_SCHEDULE_URL = USER_BASE_URL + "schedules/";
const GENERIC_SCHEDULE_URL = GENERIC_BASE_URL + "schedules/";

const getSchedules = () => {
  const url = USER_BASE_URL + "schedules" + "?filter[include][events]=media";
  return fetch(url, {
    method: 'GET',
    headers: WHENHUB_API_HEADERS
  }).then((response) => {
    return response.json();
  });
}

const createSchedule = (schedule) => {
  const url = USER_SCHEDULE_URL;
  return fetch(url, {
    method: 'POST',
    headers: WHENHUB_API_HEADERS,
    body: JSON.stringify(schedule)
  }).then((response) => {
    return response.json();
  });
}

const createEvent = (scheduleId, event) => {
  const url = GENERIC_SCHEDULE_URL + scheduleId + "/events";
  return fetch(url, {
    method: 'POST',
    headers: WHENHUB_API_HEADERS,
    body: JSON.stringify(event)
  }).then((response) => {
    return response.json();
  });
}

const updateSchedule = (updatedFields, scheduleId) => {
  const url = GENERIC_SCHEDULE_URL + scheduleId;
  return fetch(url, {
    method: 'PATCH',
    headers: WHENHUB_API_HEADERS,
    body: JSON.stringify(updatedFields)
  });
}

const updateEvent = (updatedFields, scheduleId, eventId) => {
  const url = GENERIC_SCHEDULE_URL + scheduleId + "/events/" + eventId;
  return fetch(url, {
    method: 'PUT',
    headers: WHENHUB_API_HEADERS,
    body: JSON.stringify(updatedFields)
  });
}

const deleteSchedule = (scheduleId) => {
  const url = GENERIC_SCHEDULE_URL + scheduleId;
  return fetch(url, {
    method: 'DELETE',
    headers: WHENHUB_API_HEADERS
  });
}

const deleteEvent = (scheduleId, eventId) => {
  const url = GENERIC_SCHEDULE_URL + scheduleId + "/events/" + eventId;
  return fetch(url, {
    method: 'DELETE',
    headers: WHENHUB_API_HEADERS
  });
}