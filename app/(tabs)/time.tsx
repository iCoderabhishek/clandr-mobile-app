import { Clock, Pause, Play, RotateCcw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const timerPresets = [5, 10, 15, 25, 30, 45];

export default function TimeScreen() {
  const [now, setNow] = useState(new Date());
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [preset, setPreset] = useState(5); // default 5 minutes

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const formatClock = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const formatCountdown = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const startCountdown = (min: number) => {
    setPreset(min);
    setSecondsLeft(min * 60);
    setIsRunning(true);
  };

  const toggleCountdown = () => {
    if (secondsLeft > 0) setIsRunning((prev) => !prev);
  };

  const resetCountdown = () => {
    setIsRunning(false);
    setSecondsLeft(preset * 60);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="pt-4 px-4 pb-2">
          <Text className="text-3xl font-bold text-gray-800">
            Productivity Timer
          </Text>
          <Text className="text-gray-600 text-lg">
            Track time and stay productive 🏃‍♂️
          </Text>
        </View>

        {/* Current Time */}
        <View className="bg-white rounded-3xl shadow-md p-8 mx-4 my-4 items-center">
          <View className="bg-blue-100 rounded-full p-4 mb-4">
            <Clock size={32} color="#3B82F6" />
          </View>
          <Text className="text-4xl font-bold text-gray-800 mb-1">
            {formatClock(now)}
          </Text>
          <Text className="text-gray-600">
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Focus Timer */}
        <View className="bg-white rounded-3xl shadow-md p-6 mx-4 my-2 ">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Focus Timer
          </Text>

          {/* Countdown Display */}
          <View className="items-center mb-6">
            <View
              className="bg-blue-950 items-center justify-center mb-4"
              style={{
                width: 192,
                height: 192,
                borderRadius: 96, // half of width/height
              }}
            >
              <Text className="text-white text-4xl font-bold">
                {formatCountdown(secondsLeft)}
              </Text>
            </View>

            {/* Controls */}
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={toggleCountdown}
                className="bg-blue-50 rounded-full p-4"
                disabled={secondsLeft === 0}
              >
                {isRunning ? (
                  <Pause size={24} color="#3B82F6" />
                ) : (
                  <Play size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetCountdown}
                className="bg-gray-100 rounded-full p-4"
              >
                <RotateCcw size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Presets */}
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Start
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {timerPresets.map((min) => (
              <TouchableOpacity
                key={min}
                onPress={() => startCountdown(min)}
                className={`px-4 py-3 mb-3 rounded-2xl ${
                  preset === min
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-gray-50"
                }`}
                style={{ width: "30%" }}
              >
                <Text
                  className={`text-center font-semibold ${
                    preset === min ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {min}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* World Clock */}
        <View className="bg-white rounded-3xl shadow-md p-6 mx-4 my-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            World Clock
          </Text>
          {[
            { city: "New Delhi", zone: "Asia/Kolkata" },
            { city: "London", zone: "Europe/London" },
            { city: "New York", zone: "America/New_York" },
            { city: "Tokyo", zone: "Asia/Tokyo" },
            { city: "Sydney", zone: "Australia/Sydney" },
          ].map(({ city, zone }, idx, arr) => (
            <View
              key={city}
              className={`flex-row justify-between py-3 ${
                idx < arr.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <Text className="text-gray-800 font-medium">{city}</Text>
              <Text className="text-gray-600">
                {new Date().toLocaleTimeString("en-US", {
                  timeZone: zone,
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
