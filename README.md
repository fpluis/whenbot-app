# whenbot

Chatbot that uses WhenHub's API to manage your schedules. Entry into the WhenHub Hackathon, "Best use of WhenHub API" category. 

## Usage

_Note that the demo is currently not working as WhenHub changed the login for APIs method we were using._

~~Try the [demo].~~ After logging in, use the chat input to type or speak using the microphone, and WhenBot will carry out your orders. By asking for help, it will read the list of available actions.

## What is it?

The WhenBot allows users to add, see, edit or delete their WhenHub schedules and events. Additionally, users can "timeshift" a schedule, moving its events in time any arbitrary time amount, or to any particular date.

All the interaction is performed using natural language, and although there is a chat interface, it is designed so that users can speak to it and listen without having to look at the screen. This makes it ideal for situations where the user cannot use a computer screen, but still wants to quickly check or change schedules or events.

## Disclaimer

The demo is just a proof of concept. It only supports some browsers, as it uses experimental browser APIs and ES6 syntax, with neither polyfills nor transpilation. Tested only with the latest version of Chrome. Also, it isn't optimized for production (not bundled, minified and gzipped).

[demo]: https://studio.whenhub.com/signin/?redirect_url=https://rtomrud.github.io/whenbot-app/
