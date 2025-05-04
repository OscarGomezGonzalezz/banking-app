import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedReaction,
  withSpring,
  scrollTo,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { animationConfig, COL, getOrder, getPosition, SIZE } from './Config';

const Item = ({ children, positions, id, editing, onDragEnd, scrollView, scrollY }) => {
  const inset = useSafeAreaInsets();
  const containerHeight = Dimensions.get('window').height - inset.top - inset.bottom;
  const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;
  const isGestureActive = useSharedValue(false);

  const initialPos = getPosition(positions.value[id]);
  const translateX = useSharedValue(initialPos.x);
  const translateY = useSharedValue(initialPos.y);

  useAnimatedReaction(
    () => positions.value[id],
    (newOrder) => {
      if (!isGestureActive.value) {
        const pos = getPosition(newOrder);
        translateX.value = withTiming(pos.x, animationConfig);
        translateY.value = withTiming(pos.y, animationConfig);
      }
    }
  );

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (editing) {
        ctx.x = translateX.value;
        ctx.y = translateY.value;
        isGestureActive.value = true;
      }
    },
    onActive: ({ translationX, translationY }, ctx) => {
      if (editing) {
        translateX.value = ctx.x + translationX;
        translateY.value = ctx.y + translationY;

        // Calculate new order
        const newOrder = getOrder(
          translateX.value,
          translateY.value,
          Object.keys(positions.value).length - 1
        );

        const oldOrder = positions.value[id];
        if (newOrder !== oldOrder) {
          const idToSwap = Object.keys(positions.value).find(
            key => positions.value[key] === newOrder
          );
          if (idToSwap) {
            // Deep clone positions
            const newPositions = JSON.parse(JSON.stringify(positions.value));
            newPositions[id] = newOrder;
            newPositions[idToSwap] = oldOrder;
            positions.value = newPositions;
          }
        }

        // Auto-scroll if dragging beyond bounds
        const lowerBound = scrollY.value;
        const upperBound = lowerBound + containerHeight - SIZE;
        const maxScroll = contentHeight - containerHeight;
        if (translateY.value < lowerBound) {
          const diff = Math.min(lowerBound - translateY.value, lowerBound);
          scrollY.value -= diff;
          scrollTo(scrollView, 0, scrollY.value, false);
          ctx.y -= diff;
          translateY.value = ctx.y + translationY;
        }
        if (translateY.value > upperBound) {
          const diff = Math.min(translateY.value - upperBound, maxScroll - scrollY.value);
          scrollY.value += diff;
          scrollTo(scrollView, 0, scrollY.value, false);
          ctx.y += diff;
          translateY.value = ctx.y + translationY;
        }
      }
    },
    onEnd: () => {
      const finalPos = getPosition(positions.value[id]);
      translateX.value = withTiming(finalPos.x, animationConfig, () => {
        isGestureActive.value = false;
        runOnJS(onDragEnd)(positions.value);
      });
      translateY.value = withTiming(finalPos.y, animationConfig);
    },
  });

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = withSpring(isGestureActive.value ? 1.05 : 1);
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      zIndex,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={style}>
      <PanGestureHandler enabled={editing} onGestureEvent={onGestureEvent}>
        <Animated.View style={StyleSheet.absoluteFill}>{children}</Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default Item;
