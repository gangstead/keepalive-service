keepalive-service
===================

*Keep track of when you did that thing.  Get an alert when you don't.*

Help remember to do a frequent task (take medicine, walk the dog, weigh yourself).  Get notified when you forget.  Track your progress over time.  Works with physical IOT buttons.

# API
### Buttons
- `GET` `/buttons`
- `POST` `/buttons`
- `GET` `/users/{userId}/buttons` (todo)
- `GET` `/buttons/{buttonId}`
- `GET` `/buttons/{buttonId}/stats` (todo)

### Presses
- `GET|POST` `/buttons/{buttonId}/presses` (todo)
- `GET` `/presses/{pressId}` (todo)

### Schedules
- `GET|POST` `/buttons/{buttonId}/schedules` (todo)
- `GET` `/schedules/{scheduleId}` (todo)

### Alerts
- `GET|POST` `/schedules/{scheduleId}/alerts` (todo)
- `GET` `/alerts/{alertId}` (todo)

### User
- `POST` `/users`
- `GET` `/users/{userId}/stats` (todo)

### Authentication
- `POST` `/login` (todo)

## Objects
```js
const button = {
    id: 'f3d2cbb0-ef7b-4de1-9314-6e7a345f3bf4',
    name: 'big yellow button',
    type: 'bttn'
}
```
```js
const press = {
    id: 'f8546bc5-39ed-4334-b39e-592ec4666bea'
    buttonId: 'f3d2cbb0-ef7b-4de1-9314-6e7a345f3bf4',
    pressTime: '2015-01-13T18:25:43.511Z'
}
```
```js
const schedule = {
    id: '5a925-6bcc-4a1c-b7b1-5862ab054e4a',
    buttonId: 'f3d2cbb0-ef7b-4de1-9314-6e7a345f3bf4',
    title: 'Ivy\'s Tylenol',
    frequency: 2,
    frequencyUnit: 'day',
    period: 43200000,   // 12 hours in milliseconds
    resetAutomatically: false // false = button press resets timer, true=timer resets regardless of button press
}
```
```js
var alert = {
    id: 'ef5de5cd-22c1-49c4-a396-b26899161379',
    scheduleId: '5a925-6bcc-4a1c-b7b1-5862ab054e4a',
    action: "sms|email|webhook",
    sms: "9724142777",      // iff action == sms
    email: "steven@gangstead.com", // iff action email
    webhook: "http://example.com/mywebhook/123" // iff action = webhook, will POST
}
```
```js
var user = {
    id: 'd5e39959-c359-4ef2-b9e5-67e0628449f4',
    name: 'Steven Gangstead',
    email: 'steven@gangstead.com',
    login: 'gangstead',
    confirmed: true
}
```

# Developing
Development is done on your local machine, but the tests are run inside of a docker container.  This allows you to run the service and database locally on linux, no matter what OS your development machine is running.

1. have git, node, npm, docker, docker-compose installed and the repo cloned
1. `npm install` - installs npm dependencies
1. `npm run dcr db-setup` - The first time you run this you might get a ECONNREFUSED if the db is slow to start up.  Just try a couple times.  This command will pull the base node and postgres containers, mount the code, create the database, and run all migration files.  Subsequent runs will only perform new migrations, if present.
1. `npm run dcr test` - Run the unit tests
