const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Response = use('Adonis/Src/Response')
  const responses = [
    { status: 200, name: 'ok', defaultMessage: null },
    { status: 201, name: 'created', defaultMessage: 'Successfully created' },
    { status: 400, name: 'badRequest', defaultMessage: 'Could not perform the operation!' },
    { status: 401, name: 'unauthorized', defaultMessage: 'unauthorized' },
    { status: 403, name: 'forbidden', defaultMessage: 'forbidden' },
    { status: 404, name: 'notFound', defaultMessage: 'notFound' },
    { status: 500, name: 'internalServer', defaultMessage: 'Internal server error' },
    { status: 502, name: 'BadGateway', defaultMessage: 'Erro de ligação. Por favor tente novamente' }
  ]

  responses.forEach((res) => {
    Response.macro(res.name, function (data, overrideDefaults = { status: null, message: null }) {
      this.status(overrideDefaults.status || res.status).json({
        statusCode: overrideDefaults.status || res.status,
        message: overrideDefaults.message || res.defaultMessage,
        data: data
      })
    })
  })
})

hooks.after.providersRegistered(() => {
  const Validator = use('Validator')
  const existsFn = use('App/Validators/Custom/exists')
  Validator.extend('exists', existsFn)
})
