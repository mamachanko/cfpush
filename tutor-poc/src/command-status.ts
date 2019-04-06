export const UNSTARTED = 'UNSTARTED';
export const RUNNING = 'RUNNING';
export const INPUT_REQUIRED = 'INPUT_REQUIRED';
export const FINISHED = 'FINISHED';

export type CommandStatus =
    | typeof UNSTARTED
    | typeof RUNNING
    | typeof INPUT_REQUIRED
    | typeof FINISHED;
