medi-button-service
===================

# API
### Buttons
- `POST` `/users/{userId}/buttons`
- `POST` `/buttons`
- `GET` `/buttons/{buttonId}`

### Presses
- `GET|POST` `/buttons/{buttonId}/presses`
- `GET` `/presses/{pressId}`

### Schedules (aka Prescriptions?)
- `GET|POST` `/buttons/{buttonId}/schedules`
- `GET` `/schedules/{scheduleId}`

### Alerts
- `GET|POST` `/schedules/{scheduleId}/alerts`
- `GET` `/alerts/{alertId}`

### User
- `POST` `/users`

### Authentication
- `POST` `/login` 

### Stats
- `GET` `/users/{userId}/stats`
- `GET` `/buttons/{buttonId}/stats`

## Objects
```js
var button = {
    id: 'f3d2cbb0-ef7b-4de1-9314-6e7a345f3bf4',
    name: 'big yellow button',
    type: 'bttn'
}
```
```js
var schedule = {
    id: '5a925-6bcc-4a1c-b7b1-5862ab054e4a',
    buttonId: 'f3d2cbb0-ef7b-4de1-9314-6e7a345f3bf4',
    title: 'Ivy\'s Keppra',
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


