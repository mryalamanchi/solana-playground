import { FC, Suspense, lazy, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import styled, { css } from "styled-components";
import { Resizable } from "re-resizable";

import Loading from "../../../Loading";
import { DEFAULT_CURSOR } from "../../../../constants";
import { TAB_HEIGHT } from "../../Main/Tabs/Tabs";
import { Sidebar } from "../sidebar-values";
import { PgShare } from "../../../../utils/pg/share";
import { PgExplorer } from "../../../../utils/pg/explorer";
import { explorerAtom } from "../../../../state";

const Explorer = lazy(() => import("./Explorer"));
// const Search = lazy(() => import("./Search"));
const BuildDeploy = lazy(() => import("./BuildDeploy"));
const Test = lazy(() => import("./Test"));

interface RightProps {
  sidebarState: string;
}

const Right: FC<RightProps> = ({ sidebarState }) => {
  const [explorer, setExplorer] = useAtom(explorerAtom);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/") setExplorer(new PgExplorer());
    else {
      const getShare = async () => {
        try {
          const explorerData = await PgShare.getShare(pathname);

          setExplorer(new PgExplorer(explorerData));
        } catch {
          // Couldn't get the data
          // TODO: Not found page
          // Redirect to main for now
          navigate("/");
        }
      };

      getShare();
    }
  }, [pathname, navigate, setExplorer]);

  useEffect(() => {
    if (explorer) setLoading(false);
  }, [explorer, setLoading]);

  return (
    <Resizable
      defaultSize={{
        width: 320,
        height: "100%",
      }}
      minWidth={320}
      minHeight="100%"
      maxWidth={window.innerWidth * 0.75}
      handleStyles={{
        top: DEFAULT_CURSOR,
        topLeft: DEFAULT_CURSOR,
        topRight: DEFAULT_CURSOR,
        left: DEFAULT_CURSOR,
        bottomRight: DEFAULT_CURSOR,
        bottom: DEFAULT_CURSOR,
      }}
    >
      <Wrapper>
        <StyledTitle sidebarState={sidebarState} />
        <Suspense fallback={<RightLoading />}>
          {loading ? <RightLoading /> : <Inside sidebarState={sidebarState} />}
        </Suspense>
      </Wrapper>
    </Resizable>
  );
};

const Inside: FC<RightProps> = ({ sidebarState }) => {
  switch (sidebarState) {
    case Sidebar.EXPLORER:
      return <Explorer />;
    // case Sidebar.SEARCH:
    //   return <Search />;
    case Sidebar.BUILD_DEPLOY:
      return <BuildDeploy />;
    case Sidebar.TEST:
      return <Test />;
    default:
      return null;
  }
};

interface TitleProps extends RightProps {
  className?: string;
}

const Title: FC<TitleProps> = ({ sidebarState, className }) => (
  <div className={className}>
    <span>{sidebarState.toUpperCase()}</span>
  </div>
);

export const RightLoading = () => (
  <LoadingWrapper>
    <Loading />
  </LoadingWrapper>
);

const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    min-width: 20rem;
    height: 100%;
    background-color: ${theme.colors?.right?.bg ?? "inherit"};
    border-left: 1px solid ${theme.colors.default.borderColor};
    border-right: 1px solid ${theme.colors.default.borderColor};
  `}
`;

const StyledTitle = styled(Title)`
  height: ${TAB_HEIGHT};
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.default.borderColor};
  color: ${({ theme }) => theme.colors.default.textSecondary};
`;

export const LoadingWrapper = styled.div`
  margin-top: 2rem;
`;

export default Right;
