const isSameStringCaseInsensitive = (firstItem, secondItem) => {
  const firstString = String(firstItem);
  const secondString = String(secondItem);
  return firstString != null
    && secondString != null
    && firstString.toLowerCase() == secondString.toLowerCase();
};

// Adapted from http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
const objectIsEmpty = (object) => {
  return object != null
    && Object.keys(object).length === 0
    && object.constructor === Object;
};

const arrayIsEmpty = (array) => {
  return array == null || array == [] || array.length <= 0;
};

const valueToDateString = (value) => {
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  return new Date(value).toLocaleTimeString("en-us", dateOptions);
};

const assignProperties = (object, objectWithNewProperties) => {
  if (objectWithNewProperties == null) {
    Object.keys(objectWithNewProperties).forEach((key) => {
      object[key] = objectWithNewProperties[key];
    });
    return object;
  } else {
    return object;
  }
};

const removeFromArrayById = (array, id) => {
  return array.filter((item) => {
    return item.id != id;
  });
};

// Credit: Quentin
// Taken from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
const getQueryParameter = () => {
  var queryString = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (typeof queryString[pair[0]] === "undefined") {
      queryString[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof queryString[pair[0]] === "string") {
      var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
      queryString[pair[0]] = arr;
    } else {
      queryString[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return queryString;
};
