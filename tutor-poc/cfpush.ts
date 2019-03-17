import * as blessed from 'blessed';
import { spawn } from 'child_process';
import { ServerResponse } from 'http';

const screen = blessed.screen({
    smartCSR: true,
    // log: ['cfpush.log']
});

screen.title = 'cfpush';

const body = blessed.log({
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    keys: true,
    mouse: true,
    tags: true,
    alwaysScroll: true,
    scrollable: true,
    scrollOnInput: false,
    scrollbar: {
        ch: '-',
    }, 
    border: {
        type: 'line'
    }
});


screen.append(body);

screen.key(['escape', 'q', 'C-c'], _ => process.exit(0));

const log = (text) => {
    body.pushLine(text);
    screen.render();
}

screen.key('space', _ => {

    const container = blessed.box({
        top: 'center',
        left: 'center',
        height: '50%',
        width: '50%',
        border: {
            type: 'line'
        }
        });

    const command = blessed.log({
        height: '100%-3',
        keys: true,
        mouse: true,
        tags: true,
        draggable: true,
        scrollable: true,
        alwaysScroll: true,
        style: {
            fg: 'green', 
            bg: 'black'
        }
    });

    container.append(command);

    screen.append(container)
    screen.render();

    const cfLogin = spawn('cf', ['login', '-a', 'api.run.pivotal.io', '-sso'], {stdio: [screen.input]});
    
    cfLogin.stdout.on('data', function (data) {
        const x = data.toString()
        command.pushLine(`${data.toString()}`);
        screen.render();

        if (data.toString().endsWith('> ')) {
            const inputBar = blessed.textbox({
                bottom: 0,
                height: 1,
                width: '100%-2',
                keys: true,
                mouse: true,
                inputOnFocus: true,
                style: {
                    fg: 'white',
                    bg: 'blue'
                }
            });
            
            inputBar.on('submit', (text) => {
                inputBar.clearValue();
                inputBar.destroy();
                screen.render();
                cfLogin.stdin.write(text + '\n');
            });
            
            container.append(inputBar);
            screen.render();
            inputBar.focus();
        } 
    });

    cfLogin.on('exit', function (code) {
        container.destroy();
        log(`you're logged in.`);
        log('press <q> to quit');
    });
});

body.pushLine('Welcome to cfpush!');
body.pushLine('press <space> to log into PWS');

screen.render();
