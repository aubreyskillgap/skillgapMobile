import { Router } from "@/services/router";
import { useFocusEffect } from "@react-navigation/native";
import { ReactNode, useCallback, useEffect, useState } from "react";
import RecoverAccountPhase1 from "./recoverAccountPhase1";
import RecoverAccountPhase2 from "./recoverAccountPhase2";
import RecoverAccountPhase3 from "./recoverAccountPhase3";
import RecoverAccountPhase4 from "./recoverAccountPhase4";

export interface IRecoverAccount {
  next: () => void;
  back: () => void;
}

enum switchPages {
  phase1 = "phase1",
  phase2 = "phase2",
  phase3 = "phase3",
  phase4 = "phase4",
}

const RecoverAccount = () => {
  const [phases, setPhases] = useState<switchPages>(switchPages.phase1);
  const [renderingComponent, setRenderingComponent] = useState<ReactNode>();

  useFocusEffect(
    useCallback(() => {
      setPhases(switchPages.phase1)
    }, [])
  );

  useEffect(() => {
    switch (phases) {
      case switchPages.phase1:
        setRenderingComponent(<RecoverAccountPhase1 next={()=>setPhases(switchPages.phase2)} back={()=>Router.back()} />);
        break;
      case switchPages.phase2:
        setRenderingComponent(<RecoverAccountPhase2 next={()=>setPhases(switchPages.phase3)} back={()=>setPhases(switchPages.phase1)} />);
        break;
      case switchPages.phase3:
        setRenderingComponent(<RecoverAccountPhase3 next={()=>setPhases(switchPages.phase4)} back={()=>setPhases(switchPages.phase2)} />);
        break;
      case switchPages.phase4:
        setRenderingComponent(<RecoverAccountPhase4 next={()=>setPhases(switchPages.phase1)} />);
        break;
        default: 
        setRenderingComponent(<RecoverAccountPhase1 next={()=>setPhases(switchPages.phase2)} back={()=>Router.back()} />)
    }
  }, [phases]);

  return <>{renderingComponent}</>;
};
export default RecoverAccount;
