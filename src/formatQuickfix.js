/* @flow */

type FlowMessageBase = {
  context: ?string,
  descr: string,
  end: number,
  endline: number,
  line: number,
  path: string,
  start: number,
}

type FlowMessageBlame = FlowMessageBase & {
  type: 'Blame',
  loc: {
    source: string,
    type: 'SourceFile' | 'LibFile',
    start: {
      column: number,
      line: number,
      offset: number,
    },
    end: {
      column: number,
      line: number,
      offset: number,
    },
  },
};

type FlowMessageComment = FlowMessageBase & { type: 'Comment' };

type FlowMessage = FlowMessageBlame | FlowMessageComment;

type FlowError = {
  kind: 'infer',
  level: 'error',
  message: Array<FlowMessage>, 
};

type FlowJsonOutput = {
  errors?: Array<FlowError>,
  flowVersion: string,
  passed: boolean,
};

function getLocTypeTag(type: string): string {
  switch(type) {
    case 'LibFile': return '[LIB]';
      // case 'SourceFile': return '[SO]';
    default: return '';
  }
}

// Separates the error messages in it's related sub-messages 
function groupMessages(message: Array<FlowMessage>): Array<Array<FlowMessage>> {
  const { result } = message.reduce((ret, msg) => {

    if(msg.type === 'Blame') {
      if (ret.buffer.length > 0) {
        ret.result.push(ret.buffer);
      }

      ret.buffer = [msg];
    }
    else {
      ret.buffer.push(msg);
    }

    return ret;
  }, { buffer: [], result: [] });

  return result;
}

function processMessage(message: Array<FlowMessage>): string {
  return message.reduce((str, msg) => {
    if (msg.type === 'Blame') {
      // On start of the whole formatted message
      if (!str) {
        const locTypeTag = getLocTypeTag(msg.loc.type);
        const locTypeTagStr = (locTypeTag !== '' ? ` ${locTypeTag} |`: '');

        return `${msg.path}:${msg.line}:${msg.start},${msg.end}:${locTypeTagStr} ${msg.descr}`;
      }
      else {
        if (str.indexOf('Property not found in') !== -1) {
          const context = (msg.context ? ` | ${msg.context.trim()}` : '')
          return `${str} \`${msg.descr}\`${context}`;
        }
        return `${str} ${msg.descr}`;
      }
    }

    if (msg.type === 'Comment') {
      return `${str} | ${msg.descr}`;
    }

    return str;
  }, '');
}

export default function formatQuickfix(jsonOutput: FlowJsonOutput): Array<string> {
  const { errors } = jsonOutput;

  if (errors == null) {
    return [];
  }

  return errors.map((err) => processMessage(err.message));
}
