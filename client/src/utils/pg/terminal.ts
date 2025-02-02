import {
  GITHUB_URL,
  PROGRAM_ERROR,
  PROJECT_NAME,
  RPC_ERROR,
} from "../../constants";

enum TextState {
  SUCCESS = 0,
  ERROR = 1,
  WARNING = 2,
  INFO = 3,
}

interface TextInfo {
  text: string;
  state: TextState;
}

export class PgTerminal {
  static DEFAULT_HEIGHT = "25%";
  static MIN_HEIGHT = 36;

  static DEFAULT_TEXT = `Welcome to ${PgTerminal.bold(PROJECT_NAME)}.

Currently allowed crates:
  * anchor-lang
  * anchor-spl
  * mpl-token-metadata

You can request more crates from github: ${PgTerminal.underline(GITHUB_URL)}`;

  // Emojis
  static CROSS = "❌";
  static CHECKMARK = "✅";

  private static TEXTS: TextInfo[] = [
    { text: "Compiling", state: TextState.INFO },
    { text: "Finished", state: TextState.SUCCESS },
    { text: "warning", state: TextState.WARNING },
    { text: "error", state: TextState.ERROR },
  ];

  static colorText(text: string) {
    for (const textInfo of this.TEXTS) {
      text = text.replaceAll(textInfo.text, this.getColorFromState(textInfo));
    }

    return text;
  }

  static getColorFromState(textInfo: TextInfo) {
    switch (textInfo.state) {
      case TextState.SUCCESS:
        return this.success(textInfo.text);
      case TextState.ERROR:
        return this.error(textInfo.text);
      case TextState.WARNING:
        return this.warning(textInfo.text);
      case TextState.INFO:
        return this.info(textInfo.text);
      default:
        return textInfo.text;
    }
  }

  static success(text: string) {
    return `\x1B[1;32m${text}\x1B[0m`;
  }

  static error(text: string) {
    return `\x1B[1;31m${text}\x1B[0m`;
  }

  static warning(text: string) {
    return `\x1B[1;33m${text}\x1B[0m`;
  }

  static info(text: string) {
    return `\x1B[1;34m${text}\x1B[0m`;
  }

  static bold(text: string) {
    return `\x1B[1m${text}\x1B[0m`;
  }

  static underline(text: string) {
    return `\x1B[4m${text}\x1B[0m`;
  }

  /**
   * Edit build stderr
   */
  static editStderr = (stderr: string, uuid: string) => {
    // Remove full path
    stderr = stderr.replace(/\s\(\/home.+?(?=\s)/g, "");

    // Remove uuid from folders
    stderr = stderr.replaceAll(uuid, "");

    // Remove rustc error line
    const startIndex = stderr.indexOf("For more");
    if (startIndex !== -1) {
      const endIndex = stderr.indexOf(".", startIndex);
      stderr = stderr.substring(0, startIndex) + stderr.substring(endIndex + 2);
    }

    return stderr;
  };

  /**
   * Improve error messages
   */
  static convertErrorMessage(msg: string) {
    let changed = false;

    // Program errors
    for (const programErrorCode in PROGRAM_ERROR) {
      if (msg.endsWith("0x" + programErrorCode)) {
        const parts = msg.split(":");
        const ixNumber = parts[2][parts[2].length - 1];
        const programError = PROGRAM_ERROR[programErrorCode];

        msg = `\n${this.bold("Instruction index:")} ${ixNumber}\n${this.bold(
          "Reason:"
        )} ${programError}`;

        changed = true;
        break;
      }
    }

    // Rpc errors
    if (!changed) {
      for (const rpcError in RPC_ERROR) {
        if (msg.includes(rpcError)) msg = RPC_ERROR[rpcError];
      }
    }

    return msg;
  }
}
