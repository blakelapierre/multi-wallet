export const onFirstRun = (code, ui) => (...args) => (code(...args), code = () => {}, ui(...args));