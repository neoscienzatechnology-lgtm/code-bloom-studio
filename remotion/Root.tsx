import { Composition } from "remotion";
import { TheoryVideo, computeScenes, type TheoryProps } from "./TheoryVideo";
import { lesson11 } from "./lessons";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TheoryVideo"
      component={TheoryVideo}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={lesson11}
      calculateMetadata={({ props }) => ({
        durationInFrames: computeScenes(props as TheoryProps).total,
      })}
    />
  );
};
