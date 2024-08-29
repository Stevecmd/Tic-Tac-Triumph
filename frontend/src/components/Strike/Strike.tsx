import { useAppContext } from "contexts/AppContext";

import "./style.css";

function Strike() {
  const { strikeClass } = useAppContext();

  if (!strikeClass) return <></>;

  return <div className={`strike ${strikeClass}`}></div>;
}

export default Strike;
