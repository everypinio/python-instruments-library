import { variantClassMap } from "src/utils/tailwind";
import { type EdgeVariant } from "src/types/edge";
import { type TVariant } from "src/types/tailwind";
import React, { type SVGProps, memo } from "react";
import {
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
} from "reactflow";

const edgeVariantConfigMap: Record<
  EdgeVariant,
  {
    label: string;
    variant: TVariant;
    dashArray?: boolean;
    pathCount?: number;
  }
> = {
  dataframe: { label: "df", variant: "accent5" },
  orderedpair: { label: "X Y", variant: "accent5", pathCount: 2 },
  orderedtriple: { label: "X Y Z", variant: "accent5", pathCount: 3 },
  vector: { label: "V", variant: "accent5", dashArray: true },
  text: { label: "Text", variant: "accent4", dashArray: true },
  string: { label: "Text", variant: "accent4", dashArray: true },
  scalar: { label: "Scalar", variant: "accent2", dashArray: true },
  matrix: { label: "M", variant: "accent5" },
  boolean: { label: "Bool", variant: "accent6", dashArray: true },
  any: { label: "DC", variant: "accent1", dashArray: true },
};

export const CustomEdge = ({
  id,
  data,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
}: EdgeProps<{
  outputType?: string;
}>) => {
  const [, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const outputType =
    data?.outputType && data?.outputType.toLowerCase() in edgeVariantConfigMap
      ? (data?.outputType?.toLowerCase() as EdgeVariant)
      : "any";

  const edgeConfig = edgeVariantConfigMap[outputType];

  const pathList = Array.from<typeof edgeConfig>({
    length: edgeConfig.pathCount ?? 1,
  }).fill(edgeConfig);

  return (
    <>
      {pathList.map((p, index) => {
        const calculatedSourceY =
          pathList.length > 1
            ? generateCoordinates(pathList.length, sourceY)
            : [sourceY];

        const calculatedTargetY =
          pathList.length > 1
            ? generateCoordinates(pathList.length, targetY)
            : [targetY];
        const [path] = getSmoothStepPath({
          sourceX,
          sourceY: calculatedSourceY[index],
          sourcePosition,
          targetX,
          targetY: calculatedTargetY[index],
          targetPosition,
        });
        return (
          <CustomPath
            key={id}
            id={id}
            d={path}
            strokeWidth={pathList.length > 1 ? 1 : 6}
            variant={p.variant}
            dashArray={p.dashArray}
          />
        );
      })}
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className={`nodrag nopan absolute rounded-sm bg-gray-50 p-1 text-2xl font-bold italic tracking-widest text-accent5 dark:bg-gray-800`}
        >
          {edgeConfig.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

function generateCoordinates(count: number, middlePoint: number) {
  if (count === 1) {
    return [middlePoint];
  }

  const coordinates: number[] = [];
  const interval = 9;

  let offset = Math.floor(count / 2) * interval;
  if (count % 2 === 0) {
    offset -= interval / 2;
  }

  for (let i = 0; i < count; i++) {
    coordinates.push(middlePoint - offset);
    offset -= interval;
  }

  return coordinates;
}

const CustomPath = ({
  variant,
  dashArray,
  ...props
}: SVGProps<SVGPathElement> & {
  variant: TVariant;
  dashArray?: boolean;
}) => {
  return (
    <path
      fill="none"
      className={`${variantClassMap[variant].stroke} nopan cursor-pointer`}
      strokeDasharray={dashArray ? "8,8" : "0"}
      style={{
        pointerEvents: "all",
      }}
      {...props}
    />
  );
};

export default memo(CustomEdge);
