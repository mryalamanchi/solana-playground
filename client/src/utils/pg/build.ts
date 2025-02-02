import { Idl } from "@project-serum/anchor";

import { SERVER_URL } from "../../constants";
import { PgCommon } from "./common";
import { PgProgramInfo } from "./program-info";

interface BuildResp {
  uuid: string;
  stderr: string;
  kp: Buffer | null;
  idl: Idl | null;
}

export type Files = string[][];

export class PgBuild {
  static async build(files: Files) {
    const programInfo = PgProgramInfo.getProgramInfo();

    const resp = await fetch(`${SERVER_URL}/build`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files,
        uuid: programInfo.uuid,
        kp: programInfo.kp,
      }),
    });

    const result = await PgCommon.checkForRespErr(resp.clone());
    if (result?.err) throw new Error(result.err);

    const data: BuildResp = await resp.json();

    // Update programInfo localStorage
    PgProgramInfo.updateProgramInfo({
      update: 0,
      uuid: data.uuid,
      idl: data.idl,
      kp: data.kp,
    });

    return { uuid: data.uuid, stderr: data.stderr };
  }
}
