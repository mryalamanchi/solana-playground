import { useAtom } from "jotai";
import { FC, useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { explorerAtom } from "../../../../../state";
import { PgExplorer } from "../../../../../utils/pg/explorer";
import Button from "../../../../Button";
import NewItem from "./NewItem";
import useNewItem from "./useNewItem";

const Buttons = () => (
  <ButtonsWrapper>
    <NewItemButton imageName="new_file.png" title="New File" />
    <NewItemButton imageName="new_folder.png" title="New Folder" />
    <CollapseAllButton />
    <NewItem />
    <GoBackButton />
  </ButtonsWrapper>
);
const ButtonsWrapper = styled.div`
  padding: 0.25rem;
  display: flex;
  justify-content: flex-end;

  & button {
    margin: 0.5rem 0;
    padding: 0 0.5rem;
  }

  & button img {
    filter: invert(0.5);
  }

  & button:hover {
    color: initial;
    background-color: initial;

    & img {
      filter: invert(1);
    }
  }
`;

interface ButtonProps {
  imageName: string;
  title: string;
}

const NewItemButton: FC<ButtonProps> = ({ imageName, title }) => {
  const { newItem } = useNewItem();

  return (
    <Button title={title} onClick={newItem} kind="icon">
      <img src={PgExplorer.getExplorerIconsPath(imageName)} alt={title} />
    </Button>
  );
};

const CollapseAllButton = () => {
  const handleCollapse = useCallback(() => {
    PgExplorer.collapseAllFolders();
  }, []);

  return (
    <Button kind="icon" title="Collapse Folders" onClick={handleCollapse}>
      <img
        src={PgExplorer.getExplorerIconsPath("collapse.png")}
        alt="Collapse Folders"
      />
    </Button>
  );
};

const GoBackButton = () => {
  const [explorer] = useAtom(explorerAtom);

  if (!explorer?.shared) return null;

  return (
    <Link to="/">
      <Button kind="icon" title="Go back your project">
        <img
          src={PgExplorer.getExplorerIconsPath("back.png")}
          alt="Go back your project"
        />
      </Button>
    </Link>
  );
};

export default Buttons;
