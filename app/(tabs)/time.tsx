import { Clock, Pause, Play, RotateCcw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TimeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(5); // 5 minutes default

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // let interval: NodeJS.Timeout;
    let interval: any;

    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setSelectedTimer(minutes);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(selectedTimer * 60);
  };

  const timerPresets = [5, 10, 15, 25, 30, 45];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-4 pb-6 px-4">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Time</Text>
          <Text className="text-gray-600">
            Current time and productivity timers
          </Text>
        </View>

        {/* Current Time */}
        <View className="bg-white rounded-3xl shadow-lg p-8 mx-4 mb-6">
          <View className="items-center">
            <View className="bg-blue-50 rounded-full p-4 mb-4">
              <Clock size={32} color="#3B82F6" />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              {formatTime(currentTime)}
            </Text>
            <Text className="text-gray-600">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Timer Section */}
        <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Focus Timer
          </Text>

          {/* Timer Display */}
          <View className="items-center mb-6">
            <View className="bg-blue-500 rounded-full w-48 h-48 items-center justify-center mb-4">
              <Text className="text-white text-4xl font-bold">
                {formatTimer(timerSeconds)}
              </Text>
            </View>

            {/* Timer Controls */}
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={toggleTimer}
                className="bg-blue-50 rounded-full p-4"
                disabled={timerSeconds === 0}
              >
                {isTimerRunning ? (
                  <Pause size={24} color="#3B82F6" />
                ) : (
                  <Play size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetTimer}
                className="bg-gray-50 rounded-full p-4"
              >
                <RotateCcw size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timer Presets */}
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Start
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {timerPresets.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                onPress={() => startTimer(minutes)}
                className={`bg-gray-50 rounded-2xl px-4 py-3 mb-2 ${
                  selectedTimer === minutes
                    ? "bg-blue-50 border border-blue-200"
                    : ""
                }`}
                style={{ width: "30%" }}
              >
                <Text
                  className={`text-center font-semibold ${
                    selectedTimer === minutes
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {minutes}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Zones */}
        <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            World Clock
          </Text>

          {[
            { city: "London", timezone: "Europe/London" },
            { city: "New York", timezone: "America/New_York" },
            { city: "Tokyo", timezone: "Asia/Tokyo" },
            { city: "Sydney", timezone: "Australia/Sydney" },
          ].map((location, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <Text className="text-gray-800 font-medium">{location.city}</Text>
              <Text className="text-gray-600">
                {new Date().toLocaleTimeString("en-US", {
                  timeZone: location.timezone,
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
