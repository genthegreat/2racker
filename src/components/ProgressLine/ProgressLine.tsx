/***
 * Copied from
 * https://codesandbox.io/p/sandbox/react-animated-progress-bar-rh3rz?file=%2Fsrc%2FProgressLine.js%3A1%2C1-71%2C1
***/

import React, { useEffect, useState } from "react";
import "./ProgressLine.css";

interface ProgressLineProps {
  label: string;
  backgroundColor?: string;
  visualParts?: { percentage: string; color: string }[];
}

const ProgressLine = ({
  label,
  backgroundColor = "#e5e5e5",
  // expected format for visual parts
  visualParts = [
    {
      percentage: "0%",
      color: "white"
    }
  ]
}) => {
  // Starting values needed for the animation
  // Mapped by "visualParts" so it can work with multiple values dynamically
  // It's an array of percentage widths
  const [widths, setWidths] = useState(
    visualParts.map(() => {
      return 0;
    })
  );

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    // You need to wrap it to trigger the animation
    requestAnimationFrame(() => {
      // Set a new array of percentage widths based on the props
      setWidths(
        visualParts.map(item => {
          return parseFloat(item.percentage);
        })
      );
    });
  }, [visualParts]);

  return (
    <div>
      <div className="progressLabel text-center text-xs">{label}</div>
      <div
        className="progressVisualFull"
        // to change the background color dynamically
        style={{
          backgroundColor
        }}
      >
        {visualParts.map((item, index) => {
          // map each part into separate div and each will be animated
          // because of the "transition: width 2s;" css in class "progressVisualPart"
          // and because of the new width ("widths[index]", previous one was 0)
          return (
            <div
              // There won't be additional changes in the array so the index can be used
              /* eslint-disable-next-line react/no-array-index-key */
              key={index}
              style={{
                width: `${widths[index]}%`,
                // setting the actual color of bar part
                backgroundColor: item.color
              }}
              className="progressVisualPart"
            >
              { parseInt(item.percentage) > 2 ? (<span className="text-xs flex text-center justify-center leading-loose">{parseInt(item.percentage)}%</span>) : null }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressLine;
