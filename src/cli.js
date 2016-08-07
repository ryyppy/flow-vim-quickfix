/* @flow */


import formatQuickfix from './formatQuickfix';
import { exec } from 'child_process';

// TODO: refactor to child_process$Error
//       as soon as flow ships new node
//       definitions
interface ProcessError extends Error {
  code: number;
}

type ReporterFn = (input: string) => string;

function processFlowStdout(flowStdout: string): void {
  try {
    const flowJSON = JSON.parse(flowStdout);

    if (!(flowJSON instanceof Array) && flowJSON.passed === true) {
      process.exit(0);
    }

    const output = formatQuickfix(flowJSON);
    console.log(output.join('\n'));

    process.exit(1);
  } catch(e) {
    console.error(`Could not parse flow output json (${e.message})`);
    process.exit(3);
  }
}

const flow = process.argv[2];

// If there is a flow-binary defined, run a process 
if (flow != null) {
  exec(`${flow} check --json`, (err, stdout, stderr) => {
    // $FlowExpectedError 
    if (err && err.code === 1) {
      console.error(`Error while calling flow: ${err.message}`);
      process.exit(3);
    }

    processFlowStdout(stdout.toString());
  });
}
else {
  // Otherwise read from stdin
  const { stdin } = process;

  stdin.setEncoding('utf8');

  let data = '';
  stdin.on('readable', () => {
    const chunk = process.stdin.read();

    if (chunk != null) {
      data += chunk.toString();
    }
  });

  stdin.on('end', () => {
    processFlowStdout(data);
  });
}
