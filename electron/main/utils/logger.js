function createLogger(scope) {
  const write = (consoleMethod, level, message, metadata) => {
    const prefix = `[${new Date().toISOString()}] [${scope}] [${level}] ${message}`
    if (metadata === undefined) {
      consoleMethod(prefix)
      return
    }
    consoleMethod(prefix, metadata)
  }

  return {
    info(message, metadata) {
      write(console.log, 'INFO', message, metadata)
    },
    warn(message, metadata) {
      write(console.warn, 'WARN', message, metadata)
    },
    error(message, metadata) {
      write(console.error, 'ERROR', message, metadata)
    }
  }
}

module.exports = {
  createLogger
}
