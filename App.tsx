/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import {
  Dimensions,
  GestureResponderEvent,
  SafeAreaView,
  StyleSheet,
  Text as Txt,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Svg, { Circle, Rect, Text } from "react-native-svg";

const ScoreField = (props: { score: number }) => {
  const { score } = props;
  return (
    <View>
      <Txt style={styles.scoreText}>{`Score:${score}`}</Txt>
    </View>
  );
};

const TimeField = (props: { time: number }) => {
  const { time } = props;
  return (
    <View>
      <Txt style={styles.scoreText}>{`Time: ${time}s`}</Txt>
    </View>
  );
};

const Targets = (props: {
  startCordinates: { x: number; y: number };
  endCordinates: { x: number; y: number };
  buttonSize: { width: number; height: number };
  radius: number;
}) => {
  const { startCordinates, endCordinates, radius, buttonSize } = props;
  return (
    <Svg height="100%" width="100%">
      <Circle
        cx={startCordinates.x}
        cy={startCordinates.y}
        r={radius}
        stroke="red"
        strokeWidth={5}
        fill="yellow"
      />
      <Rect
        x={endCordinates.x}
        y={endCordinates.y}
        rx={20}
        width={buttonSize.width}
        height={buttonSize.height}
        fill="blue"
        fillOpacity={0.5}
      />
      <Text
        fill="black"
        fontSize="26"
        fontWeight="bold"
        x={endCordinates.x + buttonSize.width / 2}
        y={endCordinates.y}
        textAnchor="middle"
      >
        ↓Push↓
      </Text>
    </Svg>
  );
};

const HitAndGood = (props: { hit: boolean; good: boolean }) => {
  const { hit, good } = props;
  return (
    <View>
      {hit ? <Txt>HIT!!</Txt> : <Txt />}
      {good ? <Txt>Good!!</Txt> : <Txt />}
    </View>
  );
};

const defaultStartTargetSize = { width: 40, height: 40 };

const rangeCheck = (
  targetCordinates: { x: number; y: number },
  cursorCordinates: { x: number; y: number },
  targetSize: { width: number; height: number } = defaultStartTargetSize
) => {
  if (
    targetCordinates.x - targetSize.width / 2 <= cursorCordinates.x &&
    targetCordinates.x + targetSize.width / 2 >= cursorCordinates.x &&
    targetCordinates.y - targetSize.height / 2 <= cursorCordinates.y &&
    targetCordinates.y + targetSize.height / 2 >= cursorCordinates.y
  ) {
    return true;
  } else {
    return false;
  }
};

const getRandomCordinates = (min: number, w_max: number, h_max: number) => {
  const x = Math.floor(Math.random() * (w_max + 1 - min)) + min;
  const y = Math.floor(Math.random() * (h_max + 1 - min)) + min;
  return { x: x, y: y };
};

const App = () => {
  const [startCursorCordinates, setStartCursorCordinates] = React.useState({
    x: 0,
    y: 0,
  });
  const [endCursorCordinates, setEndCursorCordinates] = React.useState({
    x: 0,
    y: 0,
  });
  const [startTargetCordinates, setStartTargetCordinates] = React.useState({
    x: 0,
    y: 0,
  });
  const [endTargetCordinates, setEndTargetCordinates] = React.useState({
    x: 0,
    y: 0,
  });
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [hit, setHit] = React.useState<boolean>(false);
  const [good, setGood] = React.useState<boolean>(false);
  const [buttonSize, setButtonSize] = React.useState({
    width: 37.5,
    height: 12.5,
  });
  const [d, setD] = React.useState(0);
  const inCatchCordinate = (e: GestureResponderEvent): void => {
    const x = e.nativeEvent.locationX;
    const y = e.nativeEvent.locationY;
    if (rangeCheck(startTargetCordinates, { x, y })) {
      setHit(true);
      const start_time = performance.now();

      setStartTime(start_time);
    } else {
      setHit(false);
    }
    setStartCursorCordinates({ x, y });
  };
  const outCatchCordinate = (e: GestureResponderEvent): void => {
    const x = e.nativeEvent.locationX;
    const y = e.nativeEvent.locationY;
    if (rangeCheck(endCursorCordinates, { x, y }, buttonSize) && hit) {
      setGood(true);
      const end_time = performance.now();
      setEndTime(end_time);
    } else {
      setGood(false);
    }
    setEndCursorCordinates({ x, y });
  };
  const calcScore = (end: { x: number; y: number }): number => {
    const start = startCursorCordinates;
    const step =
      Math.pow(start.x - (end.x + buttonSize.width / 2), 2) +
      Math.pow(start.y - (end.y + buttonSize.height / 2), 2);
    const D = Math.pow(step, 0.5);
    const W = buttonSize.width;
    const a = time;
    const b = 1;
    const score = a + b * Math.log2(1 + D / W);
    setD(D);
    return score;
  };

  React.useEffect(() => {
    const result = (endTime - startTime) / 1000;
    setTime(result);
  }, [endTime]);

  React.useEffect(() => {
    const calcedScore = calcScore(endCursorCordinates);
    setScore(calcedScore);
    setGood(false);
    setHit(false);
  }, [endCursorCordinates]);

  React.useEffect(() => {
    console.log("score", score);
    console.log("distance:", d);
    console.log("time:", time);
    const { width, height } = Dimensions.get("window");
    console.log(width, height);
    const startTargetCordinate = getRandomCordinates(
      20,
      width - 100,
      height - 50
    );
    setStartTargetCordinates(startTargetCordinate);
    const endTargetCordinate = getRandomCordinates(20, width - 80, height - 80);
    setEndTargetCordinates(endTargetCordinate);
    setButtonSize({ width: 75, height: 25 });
  }, [good]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.touchableScreen}
          onPressIn={inCatchCordinate}
          onPressOut={outCatchCordinate}
        >
          <View>
            <ScoreField score={score} />
            <TimeField time={time} />
            <HitAndGood hit={hit} good={good} />
            <Targets
              startCordinates={{
                x: startTargetCordinates.x,
                y: startTargetCordinates.y,
              }}
              endCordinates={{
                x: endTargetCordinates.x,
                y: endTargetCordinates.y,
              }}
              buttonSize={{
                width: buttonSize.width,
                height: buttonSize.height,
              }}
              radius={20}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  touchableScreen: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
  },
  scoreText: {
    color: "#000",
  },
  circle: {
    borderRadius: 50,
  },
});
export default App;
