import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { CustomEdge } from "./custom-edge";

type AppDisplayProps = {
  app: Record<string, Record<string, unknown>>;
  blockName: string;
};

const FlowMiniMap = () => {
  return (
    <MiniMap
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        height: 80,
        width: 150,
      }}
      nodeColor="rgba(255, 255, 255, 0.25)"
      maskColor="rgba(255, 255, 255, 0.05)"
      zoomable
      pannable
    />
  );
};
const edgeTypes = {
  default: CustomEdge,
};

const AppDisplay = ({ app, blockName }: AppDisplayProps) => {
  const appObject = app["rfInstance"];

  if (!appObject) {
    const errMsg = `Invalid app.json found for ${blockName}, please double check and try again.`;
    console.error(errMsg);
    return (
      <div className="flex items-center justify-center gap-2 rounded border border-transparent bg-gray-100 p-2 transition duration-300 hover:border-accent1 dark:bg-gray-800">
        {errMsg}
      </div>
    );
  }

  const nodes = appObject["nodes"] as Node[];
  const edges = appObject["edges"] as Edge[];

  return (
    <div className="not-content mt-6 flex flex-col">
      <div>
        <div className="flex justify-center">
          <div style={{ width: "100vw", height: 400 }} className="">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              edgeTypes={edgeTypes}
              minZoom={0.25}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <FlowMiniMap />
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
      <div className="py-2" />
    </div>
  );
};

export default AppDisplay;
