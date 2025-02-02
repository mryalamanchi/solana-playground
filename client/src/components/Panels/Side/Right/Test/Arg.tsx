import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { IdlType } from "@project-serum/anchor/dist/cjs/idl";
import styled from "styled-components";

import Account from "./Account";
import InputLabel from "./InputLabel";
import Input, { defaultInputProps } from "../../../../Input";
import useUpdateTxVals, { Identifiers } from "./useUpdateTxVals";

interface ArgProps {
  name: string;
  type: IdlType;
}

const Arg: FC<ArgProps> = ({ name, type }) => {
  if (type === "publicKey")
    return <Account account={{ name, isMut: false, isSigner: false }} isArg />;

  return <OtherArg name={name} type={type} />;
};

const OtherArg: FC<ArgProps> = ({ name, type }) => {
  const [val, setVal] = useState("");

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  }, []);

  // For test submit
  useUpdateTxVals({ identifier: Identifiers.ARGS, k: name, v: val, type });

  const inputName = useMemo(() => {
    return Identifiers.ARGS + name;
  }, [name]);

  return (
    <Wrapper>
      <InputLabel label={name} type={type} />
      <Input
        value={val}
        name={inputName}
        onChange={handleChange}
        {...defaultInputProps}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0.5rem 0;
`;

export default Arg;
