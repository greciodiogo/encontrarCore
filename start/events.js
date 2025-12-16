const Event = use('Event')

// Email
Event.on('new::sendEmail', "EmailEvent.sendEmail")

Event.on('new::_sendEmail', "sendEmailEvent.sendEmail")

//SMS
Event.on('new::sendSms', "sendSmsEvent.sendSms")


