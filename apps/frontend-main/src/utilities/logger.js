import log from 'loglevel';

import globalValues from '../configs/globalValues';

const isDevelopment = globalValues.environment.IS_DEVELOPMENT;

// Differentiate displaying log levels depending on stage.
if (isDevelopment) {
    log.setLevel('TRACE');
} else {
    log.setLevel('SILENT');
}

// For convenience adding "log" object as global variable. So we can easily do logging (Ex. log.info("AAA")), without importing 'log' every time.
// Also note that to avoid ESLint complaining "no-undef", we have added "log" as global in ".eslintrc.js" too.
window.log = log;

export default log;

/**
 * SIDENOTE : To use this logger just use it like below in anywhere.
 *
      - log.trace(msg)
      - log.debug(msg) / log.log(msg)
      - log.info(msg)
      - log.warn(msg)
      - log.error(msg)
 */
