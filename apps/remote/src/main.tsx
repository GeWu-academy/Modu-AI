import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ModuAiRemote } from "./ModuAiRemote";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container #root not found");
}

createRoot(container).render(
  <StrictMode>
    <div style={{ padding: 24 }}>
      <ModuAiRemote
        context={{ tenantId: "t_demo", displayName: "本地预览", themeMode: "light" }}
      />
    </div>
  </StrictMode>,
);
